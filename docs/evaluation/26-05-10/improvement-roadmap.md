# Improvement Roadmap — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Overview

This roadmap consolidates the findings across all six review documents
(frontend, architecture, performance, accessibility, security, testing) into
a prioritised action plan. Items are grouped into three delivery phases.

---

## Priority Matrix

| ID   | Item                                   | Impact   | Effort | Phase |
| ---- | -------------------------------------- | -------- | ------ | ----- |
| P1-A | Fix unit test env (Vitest)             | High     | Low    | 1     |
| P1-B | Fix 17 ESLint errors                   | High     | Low    | 1     |
| P1-C | Move JWT out of localStorage           | Critical | Medium | 1     |
| P1-D | Add CSP headers                        | High     | Low    | 1     |
| P2-A | Add GuardResolver unit tests           | High     | Low    | 2     |
| P2-B | Memoize list components                | Medium   | Low    | 2     |
| P2-C | Replace inline styles with CSS Modules | Low      | Low    | 2     |
| P2-D | Update page `<title>` per route        | Medium   | Low    | 2     |
| P2-E | Raise jsx-a11y rules to `error`        | Medium   | Low    | 2     |
| P2-F | Add keyboard support to DnD backlog    | High     | Medium | 2     |
| P2-G | Eliminate `pages/` directory           | Low      | Medium | 2     |
| P3-A | Extract shared domain types            | Low      | Low    | 3     |
| P3-B | Add coverage for refinement & backlog  | High     | High   | 3     |
| P3-C | Integrate error tracking (Sentry)      | Medium   | Medium | 3     |
| P3-D | Add web vitals measurement             | Medium   | Low    | 3     |
| P3-E | Add `npm audit` to CI                  | High     | Low    | 3     |
| P3-F | Add pagination to projects & backlog   | Medium   | High   | 3     |

---

## Phase 1 — Immediate Fixes (Sprint 1, ≤ 2 days)

These items unblock the team and close the highest-severity risks.

### P1-A: Fix Unit Test Environment

**File:** `vitest.config.ts`

Add `VITE_API_BASE_URL` to the Vitest `env` config so the 8 existing unit
test files can run:

```ts
test: {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000',
  },
}
```

**Outcome:** All existing unit tests run; the team has a working feedback loop.

---

### P1-B: Fix 17 ESLint Errors

Run `npm run lint` and resolve each error. Most are:

- Unused imports (`AppHeader` in `AdminWelcome.tsx`,
  `FileTextOutlined` in `DashboardStats.tsx`,
  `FilterOutlined` in `ProjectsFilterBar.tsx`)
- Unused variables (`error` in `PasswordForm.tsx`,
  `storyId` and `prompt` in `refinement-api.ts`)
- `any` types in `src/test/mocks/handlers.ts` and `src/test/utils/store-utils.ts`

Run `npm run lint:fix` for auto-fixable issues, then address the remaining
errors manually.

**Outcome:** `npm run lint` exits with code 0; the lint gate is meaningful.

---

### P1-C: Move JWT Token Out of `localStorage`

**Files:** `src/features/auth/model/session-storage.ts`,
`src/app/api/base-api.ts`, `src/features/auth/state/admin-auth-slice.ts`

Minimum viable change:

1. Remove `token` from the data written to `localStorage`. Store only
   `email`, `displayName`, `loggedInAt`, and `role`.
2. Keep the token in Redux state only (`state.auth.session.token`).
3. Update `base-api.ts` `prepareHeaders` to read the token from
   `api.getState()` (RTK Query passes `api` as the second argument to the
   base query function).

**Outcome:** The bearer token is no longer readable by `localStorage.getItem`;
XSS exfiltration is limited to the session lifetime of the current tab.

---

### P1-D: Add Content Security Policy

Add to `index.html` `<head>` as a starting point while the CDN/proxy
configuration is updated:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
/>
```

Note: `'unsafe-inline'` for styles may be required by Ant Design. Audit the
exact requirements after adding the meta tag and tightening over time.

**Outcome:** A default CSP is in place; XSS injection of external scripts is
blocked.

---

## Phase 2 — Quality & UX Hardening (Sprint 2–3, 1–2 weeks)

### P2-A: GuardResolver Unit Tests

Add `src/app/routing/GuardResolver.test.tsx` covering:

- `guards={["public"]}` — renders children regardless of session.
- `guards={["guest"]}` with session — redirects to `/dashboard`.
- `guards={["auth"]}` without session — redirects to `/login`.
- `guards={["auth", { role: "admin" }]}` with mismatched role — redirects to
  `/unauthorized`.

### P2-B: Memoize List Components

Wrap with `React.memo`:

- `ProjectsTable`
- `BacklogBoard`
- `BacklogColumn`
- `StoryCard`
- `StoryList`

Add `useMemo` for derived data (sorted/filtered arrays) in the corresponding
hooks.

### P2-C: Replace Inline Styles

Convert `style={{ ... }}` props in `ErrorBoundary.tsx`,
`RouteErrorBoundary.tsx`, `BacklogColumn.tsx`, `StoryCard.tsx`,
`StoryList.tsx`, `ProjectForm.tsx`, `StoryEditor.tsx`, and
`SuggestionPanel.tsx` to CSS Module classes.

### P2-D: Dynamic Page `<title>`

Use a `useEffect` in each page-level component (or a shared `usePageTitle`
hook) to update `document.title`:

```ts
useEffect(() => {
  document.title = `${pageTitle} | Open Projects Hub`;
}, [pageTitle]);
```

### P2-E: Raise jsx-a11y Rules to `error`

In `eslint.config.mjs`, change:

```js
"jsx-a11y/alt-text": "warn",
"jsx-a11y/anchor-is-valid": "warn",
```

to `"error"`. Fix any violations that are exposed.

### P2-F: DnD Keyboard Accessibility

Configure `@dnd-kit`'s `KeyboardSensor` and pass `accessibility` prop to
`DndContext` in `BacklogBoard` with appropriate announcement strings for screen
readers.

### P2-G: Eliminate `pages/` Directory

Inline each thin wrapper page into its feature's `routes.tsx` file. Remove
`src/pages/`. Update imports in `src/app/routing/routes.tsx`.

---

## Phase 3 — Long-term Sustainability (Sprint 4+)

### P3-A: Extract Shared Domain Types

Create `src/shared/types/domain.ts` with:

- `ProjectSummary`
- `ProjectStatus`
- `ProjectPriority`

Update all imports in `features/dashboard/types` and `features/projects/types`.

### P3-B: Coverage for Refinement & Backlog

Add unit tests for `useRefinementWorkspace` and `useBacklog` hooks using MSW
to mock the API calls. Add `@dnd-kit/testing` for drag interaction tests.

Set a coverage threshold in `vitest.config.ts`:

```ts
coverage: {
  thresholds: { lines: 60 },
}
```

### P3-C: Error Tracking Integration

Replace the `// TODO: Send to error tracking service (e.g., Sentry)` comment
in `ErrorBoundary.componentDidCatch` with a real Sentry (or equivalent)
integration. Gate the DSN behind an environment variable.

### P3-D: Web Vitals Measurement

Add `web-vitals` to the app entry point:

```ts
import { onCLS, onINP, onLCP } from "web-vitals";
onCLS(console.log);
onINP(console.log);
onLCP(console.log);
```

In production, send metrics to the analytics endpoint instead of logging.

### P3-E: `npm audit` in CI

Add a step to the GitHub Actions workflow:

```yaml
- run: npm audit --audit-level=high
```

### P3-F: Pagination for Projects & Backlog

Implement cursor-based pagination in the RTK Query project and backlog
endpoints. Add infinite-scroll or page-number UI in `ProjectsTable` and
`BacklogBoard`.

---

## Success Metrics

By end of Phase 2, the following should be true:

| Metric              | Current | Target |
| ------------------- | ------- | ------ |
| Lint errors         | 17      | 0      |
| Unit tests passing  | 0 / 8   | 8 / 8  |
| Security score      | 5/10    | 7/10   |
| Accessibility score | 6/10    | 7/10   |
| Performance score   | 8/10    | 8.5/10 |
| Overall FE score    | 8.0/10  | 8.5/10 |
