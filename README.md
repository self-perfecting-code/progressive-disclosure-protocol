# Progressive Disclosure Protocol

Progressive Disclosure Protocol is a Markdown-first documentation system for agents and humans. The goal is to keep routing fast, keep context small, and avoid loading entire docs when a title block can route to the right section.

Core ideas:

- routers and final docs start with a compact navigation block
- the navigation block ends at a literal `<END OF NAVIGATION>` line
- agents read only that block first, then jump to the chosen file or section
- `documentation.md` is a hybrid top router, not a full flat inventory

Start with [documentation.md](./documentation.md).

## Layout

- [documentation.md](./documentation.md): top router for the protocol docs
- [protocol-router.md](./protocol-router.md): scoped router for the protocol rules
- [examples-router.md](./examples-router.md): scoped router for example fixtures
- [protocol.md](./protocol.md): final doc for the document contract
- [agent-guidance.md](./agent-guidance.md): final doc for agent-file integration guidance
- [linter.md](./linter.md): final doc for linting rules
- [`examples/minimal`](./examples/minimal): small end-to-end fixtures

## Tooling

```bash
npm run lint
npm test
```
