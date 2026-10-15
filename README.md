# Open Projects Hub Web

> React 19 + TypeScript frontend for [Open Projects Hub](https://github.com/alonsovndev/open-projects-hub): AI-assisted requirements refinement, project backlogs, and account-free client review.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Part of [alonsovndev](https://github.com/alonsovndev), the open-source engineering lab by [Alonso Villanueva](https://alonsovndev.com).

## Stack

React 19 · TypeScript · Vite · Redux Toolkit and RTK Query · Ant Design 6 · SCSS Modules · Vitest · Playwright

## Architecture

Feature-owned SPA: `src/app/` (shell, routing, store, base API), `src/features/` (auth, backlog, clients, dashboard, onboarding, projects, refinement, settings, viewer, and more), `src/shared/` (layout, pages, hooks, UI primitives), `src/resources/` (static configuration). Route guards enforce public, guest, authenticated, and role-based access.

Full reference: [docs/architecture/overview.md](docs/architecture/overview.md) · [docs/README.md](docs/README.md)

## Getting started

Requires Node.js 20.19+ and a running [Open Projects Hub API](https://github.com/alonsovndev/open-projects-hub-api).

```bash
git clone https://github.com/alonsovndev/open-projects-hub-web.git
cd open-projects-hub-web
cp .env.example .env   # API defaults to http://localhost:8000
npm install
npm run dev          # http://localhost:5173
```

| Command                                 | Purpose                                                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`                        | Lint, tests, type-check, and build                                                                                                                          |
| `npm run test:run`                      | Unit tests once                                                                                                                                             |
| `npm run test:e2e`                      | Playwright end-to-end tests (need a running API seeded with the user in `e2e/fixtures/test-users.ts`; in CI they run manually via the `E2E Tests` workflow) |
| `npm run lint` / `npm run format:check` | Code quality                                                                                                                                                |

## Known limitations

- Browser sessions require the API's cookie-session contract; access tokens stay in memory and refresh tokens use an HttpOnly cookie. See [API integration](docs/api/integration-guide.md#authentication) for migration and deployment requirements.
- The `/backlog` page loads up to 100 stories (the API maximum per request) and filters them in the browser; there is no pagination yet.
- Stories cannot be reordered manually (FR-004-03 is deferred).
- E2E coverage is limited to the auth flows and a public backlog smoke test.

## Contributing and license

See the [contribution guide](https://github.com/alonsovndev/.github/blob/main/CONTRIBUTING.md). [MIT](LICENSE).
