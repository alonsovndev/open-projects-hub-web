# Testing Review — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Score: 6 / 10 (↑ from 5 in v1)

The addition of a Playwright E2E suite is a significant improvement. Six E2E
spec files now cover the main auth flows and the home page. Unit tests exist
for the most critical business-logic hooks. However, the unit test suite is
currently broken (all 8 files fail at startup due to a missing env var), and
five feature modules have no test coverage at all.

---

## Test Infrastructure

| Tool                           | Purpose                    | Status                           |
| ------------------------------ | -------------------------- | -------------------------------- |
| Vitest 3                       | Unit and integration tests | ⚠️ Broken (env issue)            |
| @testing-library/react 16      | Component rendering        | ⚠️ Inherited from Vitest failure |
| @testing-library/user-event 14 | User interaction           | ⚠️ Inherited                     |
| msw 2                          | API mocking in tests       | Configured                       |
| Playwright 1.58                | E2E browser tests          | ✅ Working                       |
| jsdom 27                       | DOM environment for Vitest | Configured                       |
| @vitest/coverage-v8            | Code coverage              | Not measured (tests fail)        |

### Test Utilities

- `src/test/utils/render-with-providers.tsx` — renders components with Redux
  Provider and `MemoryRouter`.
- `src/test/mocks/handlers.ts` — MSW request handlers for API mocking.
- `src/test/setup.ts` — `@testing-library/jest-dom` setup.

---

## Unit / Integration Test Files

| File                                                      | Feature   | What Is Tested                       |
| --------------------------------------------------------- | --------- | ------------------------------------ |
| `features/auth/tests/use-auth.test.tsx`                   | auth      | Login hook — success and error paths |
| `features/auth/tests/use-logout.test.tsx`                 | auth      | Logout hook — session cleared        |
| `features/auth/tests/use-role.test.tsx`                   | auth      | Role selector                        |
| `features/dashboard/tests/projects-data.test.ts`          | dashboard | Project data transformation          |
| `features/projects/tests/use-create-project.test.tsx`     | projects  | Create project hook                  |
| `features/projects/tests/use-projects-overview.test.tsx`  | projects  | Projects list hook                   |
| `features/viewer/model/project-code.test.ts`              | viewer    | Project code parsing model           |
| `features/viewer/tests/find-project-requirements.test.ts` | viewer    | Requirements lookup model            |

**All 8 files fail at startup** with:

```
Error: Invalid environment configuration
  ❯ validateEnv src/config/env.ts:27:11
```

`src/config/env.ts` calls `validateEnv()` at module load time and throws when
`VITE_API_BASE_URL` is not defined. In the Vitest environment, Vite env
variables are not populated from `.env` unless explicitly configured.

**Fix:** Add `env` to `vitest.config.ts`:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      VITE_API_BASE_URL: "http://localhost:3000",
    },
    // ...
  },
});
```

---

## E2E Test Files

| File                               | Flows Covered                                            |
| ---------------------------------- | -------------------------------------------------------- |
| `e2e/auth-login.spec.ts`           | Valid login, invalid creds, field validation, navigation |
| `e2e/auth-register.spec.ts`        | Registration flow                                        |
| `e2e/auth-forgot-password.spec.ts` | Password reset request, validation, back nav             |
| `e2e/auth-reset-password.spec.ts`  | Password reset completion                                |
| `e2e/auth-session.spec.ts`         | Session persistence                                      |
| `e2e/home.spec.ts`                 | Home page smoke test                                     |

E2E tests use Page Object Models (`e2e/pages/`) and shared fixtures
(`e2e/fixtures/test-users.ts`), which is good practice for maintainability.

### E2E Gaps

| Flow                        | Covered |
| --------------------------- | ------- |
| Dashboard load              | ❌      |
| Create project              | ❌      |
| Edit / delete project       | ❌      |
| Backlog DnD reorder         | ❌      |
| Refinement story generation | ❌      |
| Settings password change    | ❌      |
| Unauthorized redirect       | ❌      |
| Viewer public flow          | ❌      |

---

## Coverage Assessment

Because the unit test suite is broken, `npm run test:coverage` cannot produce
a coverage report. Estimated coverage based on file inspection:

| Area              | Estimated Coverage |
| ----------------- | ------------------ |
| auth hooks        | ~70%               |
| viewer model      | ~80%               |
| dashboard data    | ~40%               |
| projects hooks    | ~50%               |
| refinement        | 0%                 |
| backlog           | 0%                 |
| settings          | 0%                 |
| onboarding        | 0%                 |
| shared components | 0%                 |
| routing / guards  | 0%                 |

---

## Issues

1. **All unit tests fail** — `VITE_API_BASE_URL` not set in Vitest
   environment (see fix above).
2. **Five feature modules have no tests** — refinement, backlog, settings,
   onboarding, and shared components.
3. **`GuardResolver` has no unit tests** — the route guard logic handles
   security-relevant redirects and should be tested directly.
4. **MSW handler uses `any` type** (`src/test/mocks/handlers.ts` line 15)
   causing a lint error.
5. **E2E tests depend on MSW mock server** — the full happy path tests work
   only when MSW is intercepting. Tests should be labeled clearly to indicate
   they do not test real backend integration.

---

## Recommendations

1. **Fix the Vitest env config** so the unit test suite runs.
2. **Add tests for `GuardResolver`** — cover the public, guest, auth, and
   role-based redirect cases.
3. **Add at least one E2E test for the protected dashboard** — verifies that
   the auth guard redirects unauthenticated users to `/login`.
4. **Set a coverage threshold** in `vitest.config.ts` (`coverage.thresholds`)
   to enforce minimum coverage as the suite grows.
5. **Add tests for the `refinement` and `backlog` features** — use
   `@testing-library/user-event` for interaction-heavy flows.
