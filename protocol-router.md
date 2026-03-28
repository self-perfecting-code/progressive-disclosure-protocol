# Protocol Router

Scoped router for the core protocol rules, update requirements, and lint expectations.

## Routes From

| Router Name | Path | Use |
| --- | --- | --- |
| [Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Top-level entrypoint for protocol documentation. |

## Router References

| Router Name | Path | Use |
| --- | --- | --- |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Protocol Specification](./protocol.md) | [./protocol.md](./protocol.md) | Core file shapes, index rules, and navigation semantics. |
| [Linter Rules](./linter.md) | [./linter.md](./linter.md) | Validation rules for structure, links, and line numbers. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-scope) | [Scope](#1-scope) | Defines what this router covers for protocol authors and maintainers. | 32 | 35 |
| [2](#2-update-rules) | [Update Rules](#2-update-rules) | Summarizes what must remain correct after edits. | 36 | 39 |

<END OF NAVIGATION>

## 1. Scope

Use this router when the task is about the protocol rules themselves rather than examples or downstream skills work.

## 2. Update Rules

When protocol docs change, update the linked index entries first, then refresh maintained line numbers, and run the linter.
