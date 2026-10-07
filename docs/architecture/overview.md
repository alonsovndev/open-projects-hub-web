# Architecture Overview

## High-level View

Open Projects Hub Web is a Vite + React + TypeScript single-page application organized around **feature ownership**. The current app includes:

- a public landing page (`/`)
- an admin login page (`/login`)
- a protected admin dashboard (`/dashboard`)
- a public Client Review flow (`/viewer`, `/viewer/:accessCode`) where a client opens the approved stories of one project with its access code, no account needed
- an unauthorized fallback page (`/unauthorized`)

At a high level, the codebase separates responsibilities into four layers:

1. **`src/app/`** for application infrastructure such as routing, layouts, store setup, and the base API.
2. **`src/features/`** for business-domain code such as auth, dashboard, home, and viewer.
3. **`src/pages/`** for thin route entry points that compose features.
4. **`src/shared/`** for reusable layout and UI elements shared across features.

## Current State Scorecard

### Overall App Score

- **7.5/10**

The project has a strong architectural foundation, clear feature boundaries, modern stack choices, and a real testing foundation. The score is not higher yet because production build verification is still broken by a missing stylesheet import and the automated suite has only begun covering the highest-value paths.

### Category Scores

| Category        | Score    | Why                                                                                                                                                                                                                                                                                     |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Readability     | **8/10** | The folder structure is easy to scan, routes are declared in feature modules, and pages stay thin. The main drag on readability is duplicated or inconsistent page naming such as `src/pages/Home/` versus `src/pages/home/`.                                                           |
| Scalability     | **8/10** | Feature folders, shared layout components, typed store setup, route aggregation, and reusable test utilities make it straightforward to add new flows without centralizing all logic in one place. Scalability is still limited by placeholder product areas and incomplete test depth. |
| Maintainability | **7/10** | TypeScript, Redux Toolkit, RTK Query, clear ownership boundaries, and a working Vitest + Playwright setup support maintenance better than before. The score is held back because the build currently fails and critical auth/dashboard journeys are not yet fully covered.              |

## System Layout

### High-level responsibilities

| Layer            | Purpose                                           | Representative files                                                                                         |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/app/`       | App shell and cross-cutting infrastructure        | `src/app/App.tsx`, `src/app/routing/AppRouter.tsx`, `src/app/store/store.ts`, `src/app/api/base-api.ts`      |
| `src/features/`  | Business features and route-owned behavior        | `src/features/auth/routes.tsx`, `src/features/viewer/components/client-viewer-portal/ClientViewerPortal.tsx` |
| `src/pages/`     | Route entry points with minimal composition logic | `src/pages/home/index.tsx`, `src/pages/login/index.tsx`                                                      |
| `src/shared/`    | Shared layout primitives and reusable UI          | `src/shared/components/layout/app-header/AppHeader.tsx`, `src/shared/components/layout/footer/`              |
| `src/resources/` | Static configuration and seed-like UI content     | `src/resources/config/auth.ts`, `src/resources/config/welcome-panels.ts`                                     |

### Implementation Details

- `src/main.tsx` renders `src/app/App.tsx`.
- `src/app/App.tsx` wraps the SPA with `Provider` and `BrowserRouter`.
- `src/app/routing/routes.tsx` aggregates routes exported from each feature.
- `src/app/routing/AppRouter.tsx` maps the route list into `<Route>` elements.
- `src/app/routing/GuardResolver.tsx` enforces public, guest, authenticated, and role-based access.

## Request-to-UI Flow

1. The browser loads `src/main.tsx`.
2. `src/app/App.tsx` provides Redux state and router context.
3. `src/app/routing/AppRouter.tsx` reads the centralized route list.
4. Each route element is wrapped by `GuardResolver`.
5. Feature pages render their own components inside `PublicLayout` or `PrivateLayout`.
6. API interactions flow through `src/app/api/base-api.ts` and feature-specific endpoint modules.

## Testing-Aware Architecture

### High-level View

The app structure now supports testing as a first-class engineering concern instead of treating it as a future add-on.

### Implementation Details

- `vitest.config.ts` configures a jsdom environment for component and model tests.
- `playwright.config.ts` configures browser-level flows and starts the Vite dev server automatically for e2e runs.
- `src/test/setup.ts` centralizes matcher setup and cleanup.
- `src/test/utils/render-with-providers.tsx` gives feature components Redux and router context during tests.
- `src/app/routing/GuardResolver.tsx` keeps route-protection rules in one place, which reduces duplicated guard test setups.
- Thin route pages plus feature hooks (`use-admin-login-form.ts`, `use-admin-welcome.ts`, `use-role-selection.ts`) keep orchestration separate from presentational markup.

## Why This Architecture Works

### For junior engineers

- It is easy to find “where code should go” because folders map to responsibilities.
- You can work inside one feature without understanding the entire app at once.
- Route pages are thin, so most business logic is in features or hooks instead of being hidden inside page files.

### For senior engineers

- The routing model is declarative and feature-owned.
- State setup is centralized but not monolithic.
- RTK Query keeps API logic composable and colocated with the feature that owns it.
- Shared layout components prevent repeated auth and navigation code.

## Known Constraints

- `npm run build` currently fails because `src/pages/home/index.tsx` imports `./home.module.scss`, but that file is missing.
- `npm run test:run` passes today, but coverage is still narrow and centered on the viewer model plus a home-page smoke test.
- `npm run format:check` currently reports pre-existing formatting issues under `src/`.

These items are important context for future engineering work because they affect confidence in changes, even when the architecture itself is sound.

## Learning Resources

- [React documentation](https://react.dev/)
- [Vite guide](https://vite.dev/guide/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit overview](https://redux-toolkit.js.org/introduction/getting-started)
- [React Router docs](https://reactrouter.com/home)
