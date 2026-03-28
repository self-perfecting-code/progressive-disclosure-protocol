import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { lintPaths } from '../tools/pdp-lint.mjs';

function run() {
  const repoErrors = lintPaths(path.resolve('.'));
  assert.deepEqual(repoErrors, []);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdp-lint-'));
  const filePath = path.join(tempDir, 'broken.md');
  fs.writeFileSync(
    filePath,
    [
      '# Broken Doc',
      '',
      '## Routes From',
      '',
      '| Router Name | Path | Use |',
      '| --- | --- | --- |',
      '| [Broken Router](./broken-router.md) | [./broken-router.md](./broken-router.md) | Test route |',
      '',
      '## Index',
      '',
      '| ID | Name | Description | Line Start | Line End |',
      '| --- | --- | --- | --- | --- |',
      '| [1](#1-one) | [One](#1-two) | Broken anchors | 15 | 16 |',
      '',
      '<END OF NAVIGATION>',
      '',
      '## 1. One',
      '',
      'Body'
    ].join('\n')
  );
  fs.writeFileSync(path.join(tempDir, 'broken-router.md'), '# Broken Router\n');

  const errors = lintPaths(tempDir);
  assert.ok(errors.some((error) => error.includes('ID and Name must link to the same anchor')));
  console.log('PDP tests passed');
}

run();
