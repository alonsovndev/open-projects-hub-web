# Feature Architecture

## High-level View

The current SPA is organized around four main user-facing feature areas:

1. **Home** for role selection
2. **Auth** for admin sign-in
3. **Dashboard** for the authenticated admin area
4. **Viewer** for public requirement lookup by project code

Each feature owns its route definitions, UI components, and supporting logic. Pages remain thin entry points that compose those feature components.

## Route Map

| Route           | Page                               | Feature owner             | Access        |
| --------------- | ---------------------------------- | ------------------------- | ------------- |
| `/`             | `src/pages/home/index.tsx`         | `src/features/home/`      | Public        |
| `/login`        | `src/pages/login/index.tsx`        | `src/features/auth/`      | Guest only    |
| `/dashboard`    | `src/pages/dashboard/index.tsx`    | `src/features/dashboard/` | Authenticated |
| `/viewer`       | `src/pages/viewer/index.tsx`       | `src/features/viewer/`    | Public        |
| `/unauthorized` | `src/pages/unauthorized/index.tsx` | App-level fallback        | Public        |

## Home Feature

### High-level View

The home experience is the landing page and role selector for the application. It introduces the platform and directs users into either the admin or viewer path.

### Implementation Details

- `src/features/home/routes.tsx` registers `/`.
- `src/pages/home/index.tsx` composes `HomeHero` and `RoleSelection`.
- `src/features/home/components/home-hero/HomeHero.tsx` provides the landing message.
- `src/features/home/components/role-selection/RoleSelection.tsx` renders role cards and navigation actions.
- `src/features/home/hooks/use-role-selection.ts` uses `useNavigate()` to route the user to the selected path.

### What to Extend

- Add more role entry points in the home config when new user personas are introduced.
- Keep new marketing or explanatory sections feature-owned unless they become shared across multiple pages.
- The current Playwright smoke test in `e2e/home.spec.ts` is the starting point for Home-page coverage; the next step is extending it to verify both role-selection journeys.

## Auth Feature

### High-level View

The auth feature currently supports an admin login flow with client-side validation, session creation, and redirect into the protected dashboard.

### Implementation Details

- `src/features/auth/routes.tsx` registers `/login` as a guest-only route.
- `src/pages/login/index.tsx` renders `AdminLoginForm`.
- `src/features/auth/components/admin-login-form/AdminLoginForm.tsx` provides the form UI.
- `src/features/auth/hooks/use-admin-login-form.ts` owns field watchers, validation helpers, submit logic, and redirect behavior.
- `src/features/auth/api/admin-auth-api.ts` injects the login mutation into the shared RTK Query base API.
- `src/features/auth/state/admin-auth-slice.ts` stores the active session in Redux.
- `src/features/auth/model/` contains pure logic such as password rules and password strength calculation.

### What to Extend

- Add logout persistence cleanup when session storage becomes part of the final behavior.
- Expand role handling if non-admin authenticated users are introduced later.
- Add automated tests around validation and redirect behavior using the existing test stack: pure-model tests for password helpers, integration tests for `AdminLoginForm`, and guard-focused coverage around `/login`.

## Dashboard Feature

### High-level View

The dashboard is a protected admin-only area. Right now it acts as a placeholder that confirms sign-in and previews future workspace panels.

### Implementation Details

- `src/features/dashboard/routes.tsx` registers `/dashboard` with the `auth` guard.
- `src/pages/dashboard/index.tsx` renders `AdminWelcome`.
- `src/features/dashboard/components/admin-welcome/AdminWelcome.tsx` shows the signed-in admin name, a viewer demo action, and placeholder workspace panels.
- `src/resources/config/welcome-panels.ts` supplies static panel metadata.

### What to Extend

- Convert placeholder cards into real dashboard modules once project, refinement, and activity flows exist.
- Keep domain-specific dashboard panels inside `src/features/dashboard/` to avoid leaking business logic into pages or app-level layout code.
- Add dashboard integration tests that preload an authenticated Redux session and verify `GuardResolver`, `AdminWelcome`, viewer navigation, and sign-out behavior together.

## Viewer Feature

### High-level View

The viewer flow allows a public user to search for a project by access code and then inspect structured requirement stories.

### Implementation Details

- `src/features/viewer/routes.tsx` registers `/viewer`.
- `src/pages/viewer/index.tsx` renders `ClientViewerPortal`.
- `src/features/viewer/components/client-viewer-portal/ClientViewerPortal.tsx` toggles between the search form and the requirements view.
- `src/features/viewer/components/project-code-search/ProjectCodeSearch.tsx` captures and validates the access code.
- `src/features/viewer/components/requirements-viewer/RequirementsViewer.tsx` renders user stories and acceptance criteria.
- `src/features/viewer/model/project-code.ts` normalizes and validates the project code format.

### What to Extend

- Replace local or mock search behavior with an API-backed lookup when the viewer backend is ready.
- Preserve the existing split between the search step and the content step so the flow stays easy to reason about.
- Preserve the pure helper boundary in `src/features/viewer/model/project-code.ts`, because the existing unit tests in `project-code.test.ts` already show it is the cheapest place to lock down viewer input rules.

## App-Level Pages and Layouts

### Unauthorized Page

- `src/pages/unauthorized/index.tsx` is an app-level fallback rather than a dedicated feature module.
- It uses Ant Design `Result` and navigation actions to route the user back home or back in history.

### Layouts

- `src/app/layouts/PublicLayout.tsx` wraps public content with a shared footer.
- `src/app/layouts/PrivateLayout.tsx` adds a signed-in header and sign-out affordance for protected pages.

## Learning Resources

- [React components and hooks](https://react.dev/learn)
- [React Router navigation](https://reactrouter.com/start/declarative/navigating)
- [Ant Design component docs](https://ant.design/components/overview/)
- [Redux Toolkit slices](https://redux-toolkit.js.org/api/createSlice)
