# Open Projects Hub Web Docs

This directory is the engineering reference for the current React SPA. It is intentionally split into focused modules so teammates can either scan the high-level architecture or jump straight into the implementation details they need.

## How to Use This Documentation

- Start with [`architecture.md`](./architecture.md) for the system overview and current-state scorecard.
- Read [`features.md`](./features.md) for page-by-page and feature-by-feature responsibilities.
- Use [`tech-stack.md`](./tech-stack.md) to understand the routing, state, styling, and API patterns.
- Use [`testing.md`](./testing.md) to understand the current unit, integration, and end-to-end testing approach.
- Open [`auth-flow.md`](./auth-flow.md) when working on sign-in, protected routes, or admin session behavior.
- Review [`best-practices-audit.md`](./best-practices-audit.md) for strengths, gaps, and future improvements.
- Follow [`boilerplate.md`](./boilerplate.md) when using this project as a reference for a new SPA.

## Table of Contents

1. [Architecture Overview](./architecture.md)
2. [Feature Architecture](./features.md)
3. [Tech Stack and Patterns](./tech-stack.md)
4. [Testing Strategy and Quality Guide](./testing.md)
5. [Authentication and Authorization Flow](./auth-flow.md)
6. [Best Practices Audit and Future Improvements](./best-practices-audit.md)
7. [Boilerplate Guide for New Projects](./boilerplate.md)

## Intended Audience

### Quick Context

- **Junior engineers:** Begin with the “High-level view” sections in each file.
- **Senior engineers:** Use the “Implementation details” and “Where this lives” sections to verify code ownership and extension points.

### Repository Scope

This documentation covers the application code in `src/` and the current implementation patterns already present in the repository. It does not replace official third-party library documentation.
