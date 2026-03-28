# Protocol Specification

Defines the shared contract for documentation routers and final docs.

## Routes From

| Router Name | Path | Use |
| --- | --- | --- |
| [Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Global entrypoint for the protocol documentation. |
| [Protocol Router](./protocol-router.md) | [./protocol-router.md](./protocol-router.md) | Detailed routing path for protocol structure and semantics. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-navigation-block) | [Navigation Block](#1-navigation-block) | Defines the required top block and sentinel-based read boundary. | 29 | 32 |
| [2](#2-reference-schema) | [Reference Schema](#2-reference-schema) | Defines the required columns for router and document references. | 33 | 36 |
| [3](#3-index-rules) | [Index Rules](#3-index-rules) | Defines linked index rows, stable IDs, and maintained line metadata. | 37 | 40 |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Agent Guidance](./agent-guidance.md) | [./agent-guidance.md](./agent-guidance.md) | Rules for what existing agent files should say about the protocol. |
| [Linter Rules](./linter.md) | [./linter.md](./linter.md) | Validation requirements for protocol-compliant docs. |

<END OF NAVIGATION>

## 1. Navigation Block

Every router and final doc starts with a compact navigation block. The first pass ends at `<END OF NAVIGATION>`.

## 2. Reference Schema

Router references use `Router Name`, `Path`, and `Use`. Final-document references use `Name`, `Path`, and `Use`.

## 3. Index Rules

Each indexed row must link by both `ID` and `Name` to the same section anchor. Line numbers are maintained jump hints and should be refreshed after edits.
