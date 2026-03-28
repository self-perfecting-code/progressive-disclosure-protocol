# Agent Guidance

Describes what existing agent instruction files should say about the protocol.

## Routes From

| Router Name | Path | Use |
| --- | --- | --- |
| [Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Global entrypoint for the protocol documentation. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-traversal-rules) | [Traversal Rules](#1-traversal-rules) | Defines what agent files should tell the model about reading routers and final docs. | 26 | 29 |
| [2](#2-update-rules) | [Update Rules](#2-update-rules) | Defines what agent files should tell the model about editing protocol docs. | 30 | 33 |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Protocol Specification](./protocol.md) | [./protocol.md](./protocol.md) | Shared contract for routers, final docs, and indexed sections. |

<END OF NAVIGATION>

## 1. Traversal Rules

Agent files should tell the model to start at `documentation.md`, read only the top navigation block of routers and final docs, and stop the first pass at `<END OF NAVIGATION>`.

## 2. Update Rules

Agent files should say that edits must preserve the structure, update index links, refresh maintained line numbers, and run the linter afterward.
