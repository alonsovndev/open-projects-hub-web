# Authentication and Authorization Flow

## High-level View

The current authentication model is designed for a single admin-oriented sign-in flow:

1. A guest opens `/login`.
2. The admin enters email and password.
3. The auth feature submits credentials through RTK Query.
4. A normalized `AdminSession` is saved in Redux.
5. Protected routes read that session through `GuardResolver`.

Authorization is handled through route guards rather than custom checks embedded in individual pages.

## Login Flow

### UI Entry Point

- `src/pages/login/index.tsx` renders the form container.
- `src/features/auth/components/admin-login-form/AdminLoginForm.tsx` renders the actual form controls.

### Submit Orchestration

- `src/features/auth/hooks/use-admin-login-form.ts`:
  - watches `email` and `password`
  - calculates password strength and rule status
  - enables submit only when the form is valid
  - calls `useLoginMutation()`
  - dispatches `setAdminSession()`
  - redirects the user to `/dashboard`

### API Call

- `src/features/auth/api/admin-auth-api.ts` sends `POST /auth/login`.
- The endpoint maps different possible API response shapes into one internal `AdminSession`.
- A missing token is treated as an error to avoid creating an invalid session object.

## Session Model

### Current Shape

The auth session stores:

- token
- email
- display name
- login timestamp
- role

This normalized model makes it easier for UI code to rely on one stable session shape even if the backend returns slightly different fields.

## Guard Model

### High-level View

Route access is controlled by `src/app/routing/GuardResolver.tsx`.

### Supported Guards

| Guard               | Behavior                                     |
| ------------------- | -------------------------------------------- |
| `public`            | Always render the route                      |
| `guest`             | Redirect authenticated users to `/dashboard` |
| `auth`              | Redirect unauthenticated users to `/login`   |
| `{ role: "admin" }` | Redirect mismatched roles to `/unauthorized` |

### Why This Pattern Helps

- Pages do not need to duplicate auth checks.
- New protected routes can be added by data configuration instead of custom wrapper components every time.

## Storage and Header Preparation

### Implementation Details

- `src/app/api/base-api.ts` reads the session from local storage using `open-projects-hub.admin-session`.
- If the stored session contains a token, the app sends `Authorization: Bearer <token>`.
- If the stored value cannot be parsed, the app removes the invalid item.

## Current Gaps

- The Redux slice stores the session in memory, but the sign-in flow shown here does not document a completed end-to-end persistence write path.
- Sign-out in `PrivateLayout` clears Redux state, but future iterations should verify that storage cleanup and API invalidation are fully aligned.
- The auth flow is now test-ready, but it does not yet have dedicated integration or e2e coverage for the full happy path and failure path.

## How This Flow Should Be Tested

### Current baseline

- The repository has the tooling needed to test this flow through Vitest, React Testing Library, and Playwright.
- Auth-adjacent pure logic such as password rules and password strength lives in dedicated model files, which makes unit coverage straightforward.
- Guard behavior is centralized in `src/app/routing/GuardResolver.tsx`, so redirect logic can be tested once and reused across auth-only routes.

### Recommended coverage shape

1. **Unit tests**
   - Cover `password-policy.ts` and `password-strength.ts` directly.
   - These tests should validate rule matching, email validation, and strength scoring without rendering the DOM.
2. **Integration tests**
   - Render `AdminLoginForm` with `src/test/utils/render-with-providers.tsx`.
   - Simulate typing, verify password-rule feedback, and assert submit enablement, redirect behavior, and surfaced API errors.
3. **E2E tests**
   - Exercise `/login -> /dashboard -> return home`.
   - Verify that unauthenticated visits to `/dashboard` redirect back to `/login`.
   - Verify that authenticated visits to `/login` are redirected away by the guest guard.

## Recommended Next Steps

1. Add test coverage for guard behavior and login edge cases using the patterns in [`testing.md`](./testing.md).
2. Confirm storage write and clear behavior in one documented session service if persistence remains part of the design.
3. Expand role documentation when additional authenticated personas are introduced.

## Learning Resources

- [Redux Toolkit authentication patterns](https://redux-toolkit.js.org/usage/usage-guide)
- [RTK Query mutations](https://redux-toolkit.js.org/rtk-query/usage/mutations)
- [React Router protected navigation patterns](https://reactrouter.com/start/declarative/navigating)
- [Ant Design Form docs](https://ant.design/components/form/)
- [Testing Library async form testing](https://testing-library.com/docs/dom-testing-library/api-async/)
