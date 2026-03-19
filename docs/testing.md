# Testing Strategy and Quality Guide

## High-level View

The repository now includes a real testing stack instead of a placeholder plan. Today the project supports:

- **unit and component testing** with Vitest + React Testing Library
- **browser end-to-end testing** with Playwright
- **coverage reporting** through Vitest's V8 provider
- **shared test helpers** for Redux- and router-aware rendering

The current suite is still intentionally small, but the architecture is now test-integrated. That improves maintainability because new features can be verified without inventing a testing approach from scratch.

## Current Tooling Snapshot

| Concern                  | Current tool                                        | Where it is configured                 | Why it matters                                                                |
| ------------------------ | --------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| Unit and component tests | Vitest                                              | `package.json`, `vitest.config.ts`     | Fast local feedback and CI-friendly test runs                                 |
| DOM rendering            | React Testing Library + `@testing-library/jest-dom` | `src/test/setup.ts`                    | Encourages user-facing assertions instead of implementation-detail assertions |
| Interaction simulation   | `@testing-library/user-event`                       | `package.json`                         | Makes form and button interaction tests realistic                             |
| E2E browser flows        | Playwright                                          | `package.json`, `playwright.config.ts` | Verifies full SPA behavior across Chromium, Firefox, and WebKit               |
| Coverage                 | `@vitest/coverage-v8`                               | `vitest.config.ts`                     | Produces text, JSON, and HTML coverage reports                                |
| Test helpers             | `render-with-providers`, `redux-mock`               | `src/test/utils/`, `src/test/mocks/`   | Removes setup duplication for Redux and router-based tests                    |

## Current Coverage Baseline

### What is covered today

- `src/features/viewer/model/project-code.test.ts` covers the pure project-code normalization and validation helpers.
- `e2e/home.spec.ts` provides a Playwright smoke test for the public landing page.
- `src/test/setup.ts` standardizes DOM matchers and cleanup for every Vitest run.

### What is ready to be covered next

- `src/features/auth/model/password-policy.ts` and `password-strength.ts` are pure logic modules that are ideal unit-test targets.
- `src/features/auth/hooks/use-admin-login-form.ts` centralizes login orchestration, which makes the form flow testable through integration tests.
- `src/app/routing/GuardResolver.tsx` centralizes auth and role redirects, which makes guard behavior testable without rendering the whole app.
- `src/features/dashboard/hooks/use-admin-welcome.ts` isolates sign-out and navigation behavior from dashboard presentation.

## Testability Analysis

### Why the codebase is easier to test now

- **Thin pages** such as `src/pages/home/index.tsx`, `src/pages/login/index.tsx`, and `src/pages/dashboard/index.tsx` mostly compose feature components, so tests can focus on real behavior instead of page wiring.
- **Hooks separate orchestration from UI**. The login and dashboard flows keep navigation, dispatching, and submit logic in `use-admin-login-form.ts` and `use-admin-welcome.ts`.
- **Pure model helpers exist for business rules**. Viewer code validation and auth password rules live in standalone files, which enables cheap unit tests with no DOM setup.
- **Guards are centralized** in `GuardResolver.tsx`, so redirect logic is not duplicated across pages.
- **Shared test utilities already exist** for Redux store setup and provider-aware rendering.

## Selector strategy

The project does **not** currently rely on `data-testid` attributes. That is a healthy default for this SPA because many important controls already expose stable, accessible selectors through headings, button text, labels, and ARIA metadata.

- Prefer queries by **role**, **label text**, and **visible text** first.
- Add `data-testid` only when a repeated visual element has no stable accessible name and adding one would not improve the actual UI.
- For senior contributors: if a selector feels fragile, prefer improving semantics before adding test-only attributes.

## Standardized Testing Patterns by Page

The tables below describe both the current state and the intended pattern for the main user-facing pages.

### Home page (`/`)

| Level       | What to test                                               | Current state                         | Recommended pattern                                                              |
| ----------- | ---------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| Unit        | `useRoleSelection` navigation decisions                    | Not yet implemented                   | Mock `useNavigate`, assert `handleSelectRole()` routes to the chosen path        |
| Integration | `RoleSelection` renders role cards and triggers navigation | Not yet implemented                   | Render with router context, click the visible role CTA, assert navigation intent |
| E2E         | Landing page loads and exposes the role-selection path     | **Implemented** in `e2e/home.spec.ts` | Keep smoke coverage, then extend to both admin and viewer route entry flows      |

**Why this matters for juniors:** the Home page should prove that a public user can start the right journey.

**How seniors can optimize it:** keep assertions focused on stable content and navigation outcomes, not SCSS class names or icon markup.

### Login page (`/login`)

| Level       | What to test                                                                       | Current state                  | Recommended pattern                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Password policy and strength helpers                                               | Ready, but not yet implemented | Assert rule evaluation, email validation, and strength buckets in pure-model tests                                                        |
| Integration | `AdminLoginForm` + `useAdminLoginForm` validation, submit enablement, error states | Not yet implemented            | Render with `render-with-providers`, simulate typing with `user-event`, mock the mutation boundary, and assert redirect/dispatch behavior |
| E2E         | Full sign-in to dashboard redirect and failure feedback                            | Not yet implemented            | Use Playwright with a predictable API response to verify `/login -> /dashboard` and bad-credential handling                               |

**Why this matters for juniors:** login is the highest-risk form in the SPA, so tests should focus on what a user sees and when submit is allowed.

**How seniors can optimize it:** mock at the network or mutation boundary, not inside every helper, so the form remains exercised as one behavior slice.

### Admin Dashboard page (`/dashboard`)

| Level       | What to test                                                        | Current state       | Recommended pattern                                                                               |
| ----------- | ------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| Unit        | `useAdminWelcome` sign-out and viewer navigation helpers            | Not yet implemented | Mock navigation and assert dispatch + redirect side effects                                       |
| Integration | `GuardResolver` + `AdminWelcome` authenticated rendering            | Not yet implemented | Render with preloaded auth state to verify welcome text, redirect rules, and sign-out affordances |
| E2E         | Authenticated dashboard load, viewer shortcut, and return-home flow | Not yet implemented | Seed an authenticated session, visit `/dashboard`, then verify viewer and sign-out paths          |

**Why this matters for juniors:** the dashboard is where route protection becomes visible.

**How seniors can optimize it:** cover the guard once with focused integration tests instead of repeating auth checks in every dashboard spec.

## Project Testing Practices

### Mocking philosophy

1. **Mock at boundaries, not everywhere.**
   - Mock API responses, router navigation, or store preloaded state.
   - Avoid mocking pure helpers that are cheap to test directly.
2. **Prefer realistic rendering.**
   - Use `render-with-providers.tsx` so components run with Redux and router context close to production.
3. **Let accessibility drive selectors.**
   - If the user can find it by label or role, the test should too.
4. **Keep guard logic centralized in tests just like it is in code.**
   - Route-protection behavior belongs around `GuardResolver`, not copied into page-by-page test scaffolding.

### Coverage philosophy

- Coverage is a **guardrail**, not the goal by itself.
- Prioritize paths with the highest business risk:
  - auth validation and redirect logic
  - route guards
  - viewer access-code normalization
  - key navigation flows across Home, Login, and Dashboard
- The repository can already generate coverage with `npm run test:coverage`, but it does **not** yet enforce thresholds.
- For junior contributors: aim for meaningful assertions before aiming for big percentages.
- For senior contributors: use thresholds only after the critical paths above are consistently covered.

## CI/CD and Verification Considerations

- `npm run verify` currently runs `npm run test:run`, `npm run type-check`, and `npm run build`.
- `npm run test:e2e` uses Playwright and automatically starts the Vite dev server via `playwright.config.ts`.
- The suite increases change confidence, but the repository is **not fully green yet** because the production build still fails on a missing `src/pages/home/home.module.scss` import.
- In practice, this means testing maturity has improved faster than release readiness. The docs should continue to report both facts together.

## What Else Could Be Done

1. Add integration coverage for `GuardResolver`, `AdminLoginForm`, and `AdminWelcome`.
2. Enforce minimum coverage thresholds once the auth and dashboard flows have baseline tests.
3. Add visual regression checks for the marketing-style Home page and the admin dashboard shell.
4. Introduce API mocking with real handlers under `src/test/mocks/handlers.ts` so E2E and integration tests share realistic fixtures.
5. Publish HTML coverage and Playwright reports in CI once a dedicated application workflow exists.
6. Add authenticated Playwright helpers for seeding and clearing admin session state.

## Learning Resources

- [Vitest guide](https://vitest.dev/guide/)
- [React Testing Library intro](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library guiding principles](https://testing-library.com/docs/guiding-principles/)
- [user-event docs](https://testing-library.com/docs/user-event/intro/)
- [Playwright end-to-end testing](https://playwright.dev/docs/intro)
- [JSDOM project](https://github.com/jsdom/jsdom)
