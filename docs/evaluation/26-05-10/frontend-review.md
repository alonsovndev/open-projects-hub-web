# Frontend Review — 26-05-10

**Project:** Open Projects Hub Web
**Stack:** React 19 · TypeScript 5 · Vite 7 · Redux Toolkit 2 · Ant Design 6
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent
**Previous Audit:** v1 (30 April 2026)

---

## Executive Summary

### Overall Quality Score: 8.0 / 10 (↑ from 7.5)

Progress since the April 30 audit has been meaningful. ESLint is now fully
configured, code splitting is in place via Vite `manualChunks`, and lazy
routing is implemented with retry logic. The biggest unresolved risk remains
JWT storage in `localStorage`.

| Category          | Score | Δ     | Notes                                             |
| ----------------- | ----- | ----- | ------------------------------------------------- |
| Architecture      | 9/10  | →     | Feature-based, clean ownership, lazy routes added |
| Code Quality      | 7/10  | ↑ 0.5 | ESLint added; 17 lint errors remain open          |
| State Management  | 8/10  | →     | RTK Query well-structured; no new issues          |
| Performance       | 8/10  | ↑ 1.5 | Code splitting implemented; memoization still low |
| Accessibility     | 6/10  | ↑ 0.5 | jsx-a11y rules wired; coverage still shallow      |
| Security          | 5/10  | →     | localStorage JWT unresolved; no CSP headers       |
| Testing           | 6/10  | ↑ 0.5 | E2E suite added; unit tests blocked by env issue  |
| Developer Tooling | 8/10  | ↑ 1.0 | ESLint + Prettier + Husky fully operational       |

---

## Key Findings

### Resolved Since v1

- ✅ **ESLint configured** (`eslint.config.mjs`) with TypeScript, React, React
  Hooks, and jsx-a11y plugins.
- ✅ **Code splitting implemented** — Vite `manualChunks` separates
  `vendor-react`, `vendor-redux`, `vendor-antd`, and `vendor-dnd`.
- ✅ **Lazy routing** — all feature routes use `lazyWithRetry`, which adds
  a page-reload fallback on chunk-load failure.
- ✅ **E2E test suite** added with Playwright covering auth flows (login,
  register, forgot-password, reset-password, session) and home page.
- ✅ **Environment validation** via Zod schema in `src/config/env.ts`.
- ✅ **Error boundary** implemented in `shared/components/ErrorBoundary.tsx`
  and `app/routing/RouteErrorBoundary.tsx`.

### Open Issues

#### Critical

- ❌ **JWT stored in `localStorage`** — `src/features/auth/model/session-storage.ts`
  writes the full session object (including `token`) to `localStorage`. This is
  readable by any JavaScript on the page and is the standard XSS extraction
  target.

#### High

- ❌ **17 ESLint errors** unresolved (`npm run lint` exits non-zero). Errors
  include unused imports, unused variables, and `any` types in test utilities.
- ❌ **Unit tests all fail** at startup — `src/config/env.ts` throws at module
  load time because `VITE_API_BASE_URL` is not set in the test environment.
  The Vitest config does not supply a `.env.test` file.

#### Medium

- ❌ **26 memoization usages** across 8 files for 181 TypeScript source files —
  expensive list components (`ProjectsTable`, `BacklogBoard`) do not use
  `React.memo` or `useMemo`.
- ❌ **Inline styles** in `ErrorBoundary.tsx`, `RouteErrorBoundary.tsx`,
  `BacklogColumn.tsx`, `StoryCard.tsx`, `StoryList.tsx`, `ProjectForm.tsx`,
  `StoryEditor.tsx`, `SuggestionPanel.tsx` — violates the CSS Modules pattern
  used elsewhere.
- ❌ **No error tracking integration** — `ErrorBoundary.componentDidCatch` has
  a TODO comment for Sentry; errors are silently swallowed in production.

#### Low

- ❌ **`console.log`** calls remain in production code paths in 3 files
  (`use-create-project.ts`, `use-refinement-workspace.ts`, `use-backlog.ts`).
  The ESLint `no-console` rule is set to `warn`, so these survive the lint gate.
- ❌ **`pages/` directory** still exists as thin wrappers around feature
  components. The v1 recommendation to deprecate it has not been acted on.

---

## File Inventory

| Category          | Count |
| ----------------- | ----- |
| TypeScript files  | 181   |
| SCSS modules      | 49    |
| Unit test files   | 8     |
| E2E spec files    | 6     |
| MSW mock handlers | 1     |

---

## Recommendations

1. **Fix unit test env** — add a `src/test/.env.test` (or configure
   `vitest.config.ts` with `env: { VITE_API_BASE_URL: 'http://localhost' }`)
   so the test suite can run.
2. **Fix the 17 lint errors** — most are straightforward (remove unused
   imports, prefix unused params with `_`).
3. **Migrate JWT to `sessionStorage` or httpOnly cookie** — minimum viable
   improvement is moving from `localStorage` to `sessionStorage`; ideal is a
   backend-issued httpOnly cookie.
4. **Raise `no-console` to `error`** after replacing remaining logs with a
   dedicated logger utility.
5. **Add `React.memo`** to `ProjectsTable` and `BacklogBoard`.
6. **Replace inline styles** with CSS Module classes or Ant Design tokens.
