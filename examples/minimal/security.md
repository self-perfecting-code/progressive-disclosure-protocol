# Security Guidance

Minimal final doc used to demonstrate indexed sections, back-references, and overlapping routers.

## Routes From

| Router Name | Path | Use |
| --- | --- | --- |
| [Minimal Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Direct route when the final doc is already obvious. |
| [Security Router](./security-router.md) | [./security-router.md](./security-router.md) | Security-specific path for review and controls work. |
| [Platform Router](./platform-router.md) | [./platform-router.md](./platform-router.md) | Platform path when platform work still needs security guidance. |

## Index

| ID | Name | Description | Line Start | Line End |
| --- | --- | --- | --- | --- |
| [1](#1-principles) | [Principles](#1-principles) | Core security principles used by the example routers. | 28 | 31 |
| [2](#2-review-trigger) | [Review Trigger](#2-review-trigger) | Describes when a change should route through security review. | 32 | 35 |

## Document References

| Name | Path | Use |
| --- | --- | --- |
| [Minimal Documentation Router](./documentation.md) | [./documentation.md](./documentation.md) | Return to the top example router when the current doc is not enough. |

<END OF NAVIGATION>

## 1. Principles

Prefer the smallest read that answers the question. Route through narrower docs only when the top router says they are relevant.

## 2. Review Trigger

If a change affects auth, trust boundaries, permissions, or secret handling, the task should pass through a security-aware route.
