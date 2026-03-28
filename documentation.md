# Documentation Router

Top router for the documentation-side protocol. It lists the protocol docs that should not be skipped and routes deeper when a narrower topic is needed.

## Required Documents

| Name | Path | Use |
| --- | --- | --- |
| [Protocol Specification](./protocol.md) | [./protocol.md](./protocol.md) | Core document contract and traversal model. |
| [Agent Guidance](./agent-guidance.md) | [./agent-guidance.md](./agent-guidance.md) | How existing agent files should describe the protocol. |

## Router References

| Router Name | Path | Use |
| --- | --- | --- |
| [Protocol Router](./protocol-router.md) | [./protocol-router.md](./protocol-router.md) | Detailed rules for protocol structure, indexing, and updates. |
| [Examples Router](./examples-router.md) | [./examples-router.md](./examples-router.md) | Example fixtures that demonstrate traversal and overlap. |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Linter Rules](./linter.md) | [./linter.md](./linter.md) | Validation rules and expected failure cases. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-purpose) | [Purpose](#1-purpose) | Defines the top router role and why it is hybrid rather than exhaustive. | 34 | 37 |
| [2](#2-routing-policy) | [Routing Policy](#2-routing-policy) | Explains what belongs here versus in deeper routers or final docs. | 38 | 41 |

<END OF NAVIGATION>

## 1. Purpose

`documentation.md` is the global entrypoint for protocol-aware docs. It keeps only the globally important docs and the first routing decisions.

## 2. Routing Policy

Put globally required docs here. Put narrower material in scoped routers. Allow overlap when skipping a global reference would be risky.
