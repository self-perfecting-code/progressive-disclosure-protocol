import fs from 'node:fs';
import path from 'node:path';

const NAV_SENTINEL = '<END OF NAVIGATION>';
const AGENT_FILES = new Set(['agents.md', 'claude.md']);
const REQUIRED_SECTIONS = {
  topRouter: ['Required Documents', 'Router References', 'Document References', 'Index'],
  router: ['Routes From', 'Router References', 'Document References', 'Index'],
  finalDoc: ['Routes From', 'Index']
};
const TABLE_COLUMNS = {
  requiredDocuments: ['Name', 'Path', 'Use'],
  routerReferences: ['Router Name', 'Path', 'Use'],
  documentReferences: ['Name', 'Path', 'Use'],
  index: ['ID', 'Name', 'Description', 'Line Start', 'Line End']
};

function walk(targetPath) {
  const stats = fs.statSync(targetPath);
  if (stats.isFile()) {
    return [targetPath];
  }

  const results = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    results.push(...walk(path.join(targetPath, entry.name)));
  }
  return results;
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

function firstHeading(text) {
  const lines = normalizeNewlines(text).split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('# ')) {
      return line.trim().slice(2).trim();
    }
  }
  return null;
}

function getDocType(filePath, text) {
  const base = path.basename(filePath).toLowerCase();
  if (base === 'readme.md' || AGENT_FILES.has(base)) {
    return null;
  }
  if (base === 'documentation.md') {
    return 'topRouter';
  }
  if (base.endsWith('-router.md')) {
    return 'router';
  }
  if (text.includes(NAV_SENTINEL)) {
    return 'finalDoc';
  }
  return null;
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseTable(lines, startIndex) {
  let index = startIndex;
  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }
  const tableLines = [];
  while (index < lines.length && lines[index].trim().startsWith('|')) {
    tableLines.push(lines[index]);
    index += 1;
  }
  if (tableLines.length < 2) {
    return null;
  }
  const rows = tableLines.map((line) =>
    line
      .trim()
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim())
  );
  return {
    header: rows[0],
    body: rows.slice(2).map((cells) => Object.fromEntries(rows[0].map((key, idx) => [key, cells[idx] ?? '']))),
    nextIndex: index
  };
}

function parseSections(navLines) {
  const sections = new Map();
  for (let i = 0; i < navLines.length; i += 1) {
    const match = navLines[i].match(/^##\s+(.+?)\s*$/);
    if (!match) {
      continue;
    }
    const heading = match[1];
    const table = parseTable(navLines, i + 1);
    sections.set(heading, table);
  }
  return sections;
}

function parseBodyHeadings(lines, sentinelIndex) {
  const headings = new Map();
  const bodyHeadings = [];
  for (let i = sentinelIndex + 1; i < lines.length; i += 1) {
    const match = lines[i].match(/^(#{2,6})\s+(.+?)\s*$/);
    if (!match) {
      continue;
    }
    bodyHeadings.push({
      level: match[1].length,
      title: match[2].trim(),
      anchor: `#${slugifyHeading(match[2])}`,
      line: i + 1
    });
  }

  for (let i = 0; i < bodyHeadings.length; i += 1) {
    const current = bodyHeadings[i];
    let endLine = lines.length;
    for (let j = i + 1; j < bodyHeadings.length; j += 1) {
      if (bodyHeadings[j].level <= current.level) {
        endLine = bodyHeadings[j].line - 1;
        break;
      }
    }
    headings.set(current.anchor, { ...current, endLine });
  }
  return headings;
}

function parseLink(cell) {
  const match = cell.match(/^\[(.+?)\]\((.+?)\)$/);
  if (!match) {
    return null;
  }
  return { text: match[1], target: match[2] };
}

function collectMarkdownFiles(targetPath) {
  return walk(targetPath).filter((filePath) => filePath.toLowerCase().endsWith('.md'));
}

function collectHeadingNames(files) {
  const map = new Map();
  for (const filePath of files) {
    const text = normalizeNewlines(fs.readFileSync(filePath, 'utf8'));
    map.set(path.resolve(filePath), firstHeading(text));
  }
  return map;
}

function validateColumns(table, expected, errors, filePath, sectionName) {
  if (!table) {
    errors.push(`${filePath}: missing table under "${sectionName}"`);
    return false;
  }
  if (table.header.join('||') !== expected.join('||')) {
    errors.push(`${filePath}: invalid columns under "${sectionName}"`);
    return false;
  }
  return true;
}

function validateReferenceRows(rows, columnName, filePath, fileNames, errors) {
  for (const row of rows) {
    const label = row[columnName];
    const pathCell = row.Path;
    const labelLink = parseLink(label);
    const pathLink = parseLink(pathCell);
    if (!labelLink || !pathLink) {
      errors.push(`${filePath}: reference rows must use markdown links for "${columnName}" and "Path"`);
      continue;
    }
    const resolved = path.resolve(path.dirname(filePath), pathLink.target);
    if (!fs.existsSync(resolved)) {
      errors.push(`${filePath}: missing target ${pathLink.target}`);
      continue;
    }
    const expectedName = fileNames.get(resolved);
    if (expectedName && labelLink.text !== expectedName) {
      errors.push(`${filePath}: label "${labelLink.text}" does not match target heading "${expectedName}"`);
    }
  }
}

function validateIndexRows(rows, filePath, headings, errors) {
  for (const row of rows) {
    const idLink = parseLink(row.ID);
    const nameLink = parseLink(row.Name);
    if (!idLink || !nameLink) {
      errors.push(`${filePath}: index rows must link both ID and Name`);
      continue;
    }
    if (idLink.target !== nameLink.target) {
      errors.push(`${filePath}: ID and Name must link to the same anchor`);
      continue;
    }
    const heading = headings.get(idLink.target);
    if (!heading) {
      errors.push(`${filePath}: missing anchor target ${idLink.target}`);
      continue;
    }
    const start = Number(row['Line Start']);
    const end = Number(row['Line End']);
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      errors.push(`${filePath}: line ranges must be integers`);
      continue;
    }
    if (start !== heading.line || end !== heading.endLine) {
      errors.push(
        `${filePath}: line range for ${idLink.target} expected ${heading.line}-${heading.endLine} but found ${start}-${end}`
      );
    }
  }
}

function lintFile(filePath, fileNames) {
  const errors = [];
  const text = normalizeNewlines(fs.readFileSync(filePath, 'utf8'));
  const docType = getDocType(filePath, text);
  if (!docType) {
    return errors;
  }

  const lines = text.split('\n');
  const sentinelIndexes = lines
    .map((line, idx) => (line.trim() === NAV_SENTINEL ? idx : -1))
    .filter((idx) => idx >= 0);
  if (sentinelIndexes.length !== 1) {
    errors.push(`${filePath}: expected exactly one ${NAV_SENTINEL}`);
    return errors;
  }

  if (!lines.find((line) => line.trim().startsWith('# '))) {
    errors.push(`${filePath}: missing top-level # heading`);
  }

  const [sentinelIndex] = sentinelIndexes;
  const navLines = lines.slice(0, sentinelIndex);
  const sections = parseSections(navLines);
  const headings = parseBodyHeadings(lines, sentinelIndex);

  for (const sectionName of REQUIRED_SECTIONS[docType]) {
    if (!sections.has(sectionName)) {
      errors.push(`${filePath}: missing required section "${sectionName}"`);
    }
  }

  if (docType === 'topRouter') {
    const requiredDocuments = sections.get('Required Documents');
    const routerReferences = sections.get('Router References');
    const documentReferences = sections.get('Document References');
    const index = sections.get('Index');
    if (validateColumns(requiredDocuments, TABLE_COLUMNS.requiredDocuments, errors, filePath, 'Required Documents')) {
      validateReferenceRows(requiredDocuments.body, 'Name', filePath, fileNames, errors);
    }
    if (validateColumns(routerReferences, TABLE_COLUMNS.routerReferences, errors, filePath, 'Router References')) {
      validateReferenceRows(routerReferences.body, 'Router Name', filePath, fileNames, errors);
    }
    if (validateColumns(documentReferences, TABLE_COLUMNS.documentReferences, errors, filePath, 'Document References')) {
      validateReferenceRows(documentReferences.body, 'Name', filePath, fileNames, errors);
    }
    if (validateColumns(index, TABLE_COLUMNS.index, errors, filePath, 'Index')) {
      validateIndexRows(index.body, filePath, headings, errors);
    }
  }

  if (docType === 'router') {
    const routesFrom = sections.get('Routes From');
    const routerReferences = sections.get('Router References');
    const documentReferences = sections.get('Document References');
    const index = sections.get('Index');
    if (validateColumns(routesFrom, TABLE_COLUMNS.routerReferences, errors, filePath, 'Routes From')) {
      validateReferenceRows(routesFrom.body, 'Router Name', filePath, fileNames, errors);
    }
    if (validateColumns(routerReferences, TABLE_COLUMNS.routerReferences, errors, filePath, 'Router References')) {
      validateReferenceRows(routerReferences.body, 'Router Name', filePath, fileNames, errors);
    }
    if (validateColumns(documentReferences, TABLE_COLUMNS.documentReferences, errors, filePath, 'Document References')) {
      validateReferenceRows(documentReferences.body, 'Name', filePath, fileNames, errors);
    }
    if (validateColumns(index, TABLE_COLUMNS.index, errors, filePath, 'Index')) {
      validateIndexRows(index.body, filePath, headings, errors);
    }
  }

  if (docType === 'finalDoc') {
    const routesFrom = sections.get('Routes From');
    const documentReferences = sections.get('Document References');
    const index = sections.get('Index');
    if (validateColumns(routesFrom, TABLE_COLUMNS.routerReferences, errors, filePath, 'Routes From')) {
      validateReferenceRows(routesFrom.body, 'Router Name', filePath, fileNames, errors);
    }
    if (documentReferences && validateColumns(documentReferences, TABLE_COLUMNS.documentReferences, errors, filePath, 'Document References')) {
      validateReferenceRows(documentReferences.body, 'Name', filePath, fileNames, errors);
    }
    if (validateColumns(index, TABLE_COLUMNS.index, errors, filePath, 'Index')) {
      validateIndexRows(index.body, filePath, headings, errors);
    }
  }

  return errors;
}

export function lintPaths(targetPath) {
  const files = collectMarkdownFiles(path.resolve(targetPath));
  const fileNames = collectHeadingNames(files);
  return files.flatMap((filePath) => lintFile(filePath, fileNames));
}

function main() {
  const targetPath = process.argv[2] ?? '.';
  const errors = lintPaths(targetPath);
  if (errors.length) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
    return;
  }
  console.log('PDP lint passed');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
