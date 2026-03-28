# Agent Instructions

## Documentation Protocol

Use the Progressive Disclosure Protocol when traversing repository documentation.

- Start at [documentation.md](./documentation.md).
- For any router or final doc, read only the top navigation block first.
- Stop reading the first pass at the literal `<END OF NAVIGATION>` line.
- Use the reference tables and index links to choose the next file or the target section.
- Do not load the body content unless the navigation block indicates it is relevant.
- When editing or creating docs, preserve the same structure, update links, update maintained line numbers, and run `npm run lint` afterward.
