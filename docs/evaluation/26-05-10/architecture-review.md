# Architecture Review — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Score: 9 / 10 (→ unchanged from v1)

The architecture remains sound. The feature-based model is well-maintained,
routing has been improved with lazy loading, and ownership boundaries are
respected. The structural debt identified in April (the `pages/` folder and
the `ProjectSummary` type duplication) is still present.

---

## Layer Responsibilities

| Layer            | Path             | Responsibility                                  |
| ---------------- | ---------------- | ----------------------------------------------- |
| App shell        | `src/app/`       | Routing, store, base API, layouts               |
| Feature modules  | `src/features/`  | Business logic, UI, API endpoints, types        |
| Route pages      | `src/pages/`     | Thin wrappers (candidate for removal)           |
| Shared utilities | `src/shared/`    | Cross-cutting components and utilities          |
| Static config    | `src/resources/` | Auth config, welcome panels, other UI seed data |

### Feature Modules Inventory

| Feature    | Components | Hooks | API | State | Tests |
| ---------- | ---------- | ----- | --- | ----- | ----- |
| auth       | ✅         | ✅    | ✅  | ✅    | ✅    |
| dashboard  | ✅         | ✅    | ✅  | —     | ✅    |
| projects   | ✅         | ✅    | ✅  | —     | ✅    |
| refinement | ✅         | ✅    | ✅  | —     | —     |
| backlog    | ✅         | ✅    | ✅  | —     | —     |
| viewer     | ✅         | ✅    | ✅  | ✅    | ✅    |
| settings   | ✅         | ✅    | ✅  | —     | —     |
| onboarding | ✅         | ✅    | —   | —     | —     |
| home       | ✅         | ✅    | —   | —     | —     |

---

## Strengths

### Feature Cohesion

Each feature owns its full vertical slice:
`components/` → `hooks/` → `api/` → `types/` → `routes.tsx` → `index.ts`.
New engineers can work inside a feature without understanding the full app.

### Centralized Routing with Lazy Loading

`src/app/routing/routes.tsx` aggregates all feature routes. All route
components are loaded via `lazyWithRetry`, which adds automatic page-reload
retry on chunk-load failure — a pragmatic resilience measure for deployments.

### Guard System

`GuardResolver` in `src/app/routing/GuardResolver.tsx` is a single declarative
component that handles:

- Public routes (no auth required)
- Guest routes (redirect to dashboard if authenticated)
- Auth routes (redirect to login if unauthenticated)
- Role-based routes (`{ role: "admin" }` guard type)

### API Layer

`src/app/api/base-api.ts` creates the RTK Query root API with shared
`baseQuery`. Auth headers are injected centrally via `prepareHeaders`.
Feature APIs extend `baseApi` via `injectEndpoints`, keeping endpoint logic
colocated with the owning feature.

### Error Boundaries

Two error boundaries are in place:

- `shared/components/ErrorBoundary.tsx` — general React error boundary.
- `app/routing/RouteErrorBoundary.tsx` — route-level boundary integrated with
  React Router.

---

## Issues

### Not Yet Resolved from v1

1. **`pages/` folder** still contains thin wrappers for home, login, register,
   dashboard, and similar routes. The v1 recommendation was to collapse these
   into feature `routes.tsx` definitions.

2. **`ProjectSummary` type duplication** between `features/dashboard/types` and
   `features/projects/types` — no shared domain type has been extracted yet.

3. **Naming inconsistency in `pages/`** — e.g., `src/pages/Home/` (uppercase)
   vs `src/pages/home/` (lowercase). This is a minor maintainability issue.

### New Since v1

4. **`refinement` and `backlog` features have no tests** — these features are
   complex (they include DnD interactions and API calls) but have zero unit or
   integration test coverage.

5. **`settings` and `onboarding` features have no tests** either.

---

## Recommendations

1. **Eliminate `pages/` directory** — inline page JSX into feature
   `routes.tsx` or co-locate a `Page.tsx` inside the feature folder.
2. **Create `src/shared/types/domain.ts`** — extract `ProjectSummary`,
   `ProjectStatus`, and `ProjectPriority` into a single shared types file.
3. **Add architecture ADR** — document the import rule that features must not
   import from other features, and enforce it via ESLint
   `import/no-restricted-paths` or a custom rule.
4. **Add tests for `refinement` and `backlog`** — DnD interactions should be
   tested with `@testing-library/user-event` drag simulation.
