# Linter Rules

Defines what the protocol linter should validate for routers and final docs.

## Routes From

| Router Name | Path | Use |
| --- | --- | --- |
| [Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Global entrypoint for the protocol documentation. |
| [Protocol Router](./protocol-router.md) | [./protocol-router.md](./protocol-router.md) | Detailed routing path for protocol structure and semantics. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-structure-checks) | [Structure Checks](#1-structure-checks) | Validates required headings, sentinel placement, and table shapes. | 22 | 25 |
| [2](#2-reference-checks) | [Reference Checks](#2-reference-checks) | Validates canonical names, paths, and linked targets. | 26 | 29 |
| [3](#3-index-checks) | [Index Checks](#3-index-checks) | Validates ID and Name links, anchor targets, and maintained line ranges. | 30 | 33 |

<END OF NAVIGATION>

## 1. Structure Checks

The linter should verify the top-level headings by file type and require exactly one `<END OF NAVIGATION>` marker.

## 2. Reference Checks

The linter should verify that referenced paths exist and that the displayed router or doc name matches the target file's top heading.

## 3. Index Checks

The linter should verify that both linked columns point to the same section, that the section exists, and that maintained line numbers match the body.
