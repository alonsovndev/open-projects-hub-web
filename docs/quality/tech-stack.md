# Tech Stack and Patterns

## High-level View

The project uses a modern SPA stack aimed at keeping UI code typed, modular, and scalable:

- **Vite** for development and production builds
- **React 19** for UI composition
- **TypeScript** for static typing
- **React Router** for route handling
- **Redux Toolkit + RTK Query** for state and API integration
- **Ant Design** for structured interactive UI
- **SCSS Modules** for local component and page styling
- **Vitest + React Testing Library + Playwright** for quality verification

## Frontend Runtime

### Vite

- Provides the dev server and production build pipeline.
- Keeps the project lightweight for small-to-medium SPA development.
- Entry point: `src/main.tsx`

### React + TypeScript

- All implementation files are `.ts` or `.tsx`.
- Functional components and hooks are used throughout the app.
- The typing strategy is practical and readable: props are explicitly typed, and store types are exported centrally.

## Routing Pattern

### High-level View

Routing is **feature-owned but app-assembled**.

### Implementation Details

- Each feature exports its own route array from `src/features/<feature>/routes.tsx`.
- `src/app/routing/routes.tsx` aggregates those route arrays into `appRoutes`.
- `src/app/routing/AppRouter.tsx` maps `appRoutes` to React Router `<Route>` elements.
- `src/app/routing/GuardResolver.tsx` handles route protection in one place.

### Why This Matters

- Adding a new feature route does not require scattering changes across many files.
- Guard logic stays centralized instead of being re-implemented in each page.

## State Management Pattern

### High-level View

The repository splits state by responsibility:

- **Redux slice state** for client session data
- **RTK Query** for network interactions and API endpoint definition

### Implementation Details

- `src/app/store/store.ts` configures the Redux store and RTK Query middleware.
- `src/features/auth/state/admin-auth-slice.ts` stores the active admin session.
- `src/app/store/hooks.ts` exposes typed hooks for state access.
- `src/app/api/base-api.ts` provides a shared RTK Query base API with header preparation and error normalization.

### Benefits

- Server state and client state are not mixed together.
- Common API behavior such as auth headers and normalized errors is implemented once.

## API Integration Pattern

### High-level View

Feature modules inject endpoints into a shared base API rather than creating ad hoc fetch logic in components.

### Implementation Details

- `src/resources/config/auth.ts` defines the API base URL, login endpoint, and storage key.
- `src/app/api/base-api.ts` reads the session token from local storage and adds it to request headers.
- `src/features/auth/api/admin-auth-api.ts` injects a `login` mutation and maps the raw response to an internal `AdminSession`.

### Extension Guidance

- Keep endpoint definitions in the owning feature.
- Add response normalization close to the endpoint so UI code receives a stable shape.
- Prefer hooks and slices over component-local networking when a flow is shared or stateful.

## Styling Pattern

### High-level View

Styling is split between:

- **SCSS Modules** for local styling
- **Ant Design** for accessible and structured UI primitives

### Implementation Details

- Pages and components import `*.module.scss`.
- Ant Design is used for forms, cards, buttons, tags, layout primitives, and result states.
- Shared layout pieces such as `AppHeader` and `Footer` standardize the outer shell.

### Current Trade-Offs

- SCSS Modules keep styles local and easy to delete with the component.
- The current build failure caused by missing SCSS files shows that style imports should be kept aligned with actual files during refactors.

## Testing Pattern

### High-level View

Testing is split by confidence level instead of forcing every concern into one tool:

- **Vitest** for unit, hook, and component tests
- **React Testing Library** for DOM assertions and user-facing interactions
- **Playwright** for browser-level route validation

### Implementation Details

- `vitest.config.ts` uses `jsdom`, `src/test/setup.ts`, and V8 coverage reporting.
- `src/test/utils/render-with-providers.tsx` wraps test renders with Redux and router context.
- `src/test/mocks/redux-mock.ts` provides lightweight state setup for auth-aware scenarios.
- `src/test/mocks/handlers.ts` is a placeholder for API-level test handlers when richer mocked responses are introduced.
- `playwright.config.ts` runs e2e tests from `e2e/` across Chromium, Firefox, and WebKit.

### Why This Matters

- Contributors can choose the lightest test that proves the behavior.
- The stack encourages accessible assertions instead of brittle DOM implementation checks.
- Coverage reporting is available now, even though hard thresholds are not yet enforced.

## Documentation-Relevant Conventions

| Convention                               | Current usage                   |
| ---------------------------------------- | ------------------------------- |
| Feature folders own routes and internals | Yes                             |
| Thin pages that compose features         | Yes                             |
| Barrel exports for feature APIs          | Yes                             |
| Shared UI under `src/shared/`            | Yes                             |
| Static config under `src/resources/`     | Yes                             |
| Automated tests                          | Yes, with Vitest and Playwright |

## Learning Resources

- [Vite documentation](https://vite.dev/guide/)
- [React Router framework-free routing docs](https://reactrouter.com/start/declarative/installation)
- [Redux Toolkit RTK Query docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Ant Design overview](https://ant.design/docs/react/introduce)
- [CSS Modules documentation](https://github.com/css-modules/css-modules)
- [Vitest docs](https://vitest.dev/guide/)
- [Playwright docs](https://playwright.dev/docs/intro)
