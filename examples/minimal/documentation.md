# Minimal Documentation Router

Top router for the minimal end-to-end example.

## Required Documents

| Name | Path | Use |
| --- | --- | --- |
| [Security Guidance](./security.md) | [./security.md](./security.md) | Final doc that demonstrates indexed sections and router overlap. |

## Router References

| Router Name | Path | Use |
| --- | --- | --- |
| [Security Router](./security-router.md) | [./security-router.md](./security-router.md) | Route when the task is explicitly security-focused. |
| [Platform Router](./platform-router.md) | [./platform-router.md](./platform-router.md) | Route when the task is platform-wide and may still require security guidance. |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Security Guidance](./security.md) | [./security.md](./security.md) | Direct fallback path to the final doc when the narrow router is obvious. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-purpose) | [Purpose](#1-purpose) | Explains why the example router keeps both direct and indirect paths. | 32 | 35 |

<END OF NAVIGATION>

## 1. Purpose

This example shows the hybrid top router pattern. A final doc can be directly linked and still appear behind narrower routers.
