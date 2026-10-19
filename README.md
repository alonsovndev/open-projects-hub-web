# Open Projects Hub Web

> React 19 + TypeScript frontend for [Open Projects Hub](https://oph-docs.alonsovndev.com): AI-assisted requirements refinement, project backlogs, and account-free client review.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Part of [alonsovndev](https://github.com/alonsovndev), the open-source engineering lab by [Alonso Villanueva](https://alonsovndev.com).

**Links:** [live app](https://oph.alonsovndev.com) · [API](https://api-oph.alonsovndev.com) · [documentation](https://oph-docs.alonsovndev.com) · [open-projects-hub-api](https://github.com/alonsovndev/open-projects-hub-api) · [open-projects-hub-infra](https://github.com/alonsovndev/open-projects-hub-infra) · [open-projects-hub-docs](https://github.com/alonsovndev/open-projects-hub-docs)

## Features

- **Account and workspace:** self-service sign-up with an emailed verification code, login, password reset, and session handling (access token in memory, refresh token in an HttpOnly cookie).
- **Clients and projects:** manage clients and projects, archive and reactivate projects, search and filter, team management for administrators.
- **AI-assisted refinement:** turn raw requirement notes into user stories with acceptance criteria, review them, and approve only what should be stored.
- **Backlog:** view the approved backlog and export it as Markdown.
- **Client Review:** account-free, read-only page at `/viewer/:accessCode` where a client sees one project's approved stories.
- **Settings and dashboard:** AI credits, provider keys, workspace settings, and summary statistics.

Design reference: [DESIGN.md](DESIGN.md). Screenshots: TBD.

## Stack

React 19 · TypeScript · Vite · Redux Toolkit and RTK Query · Ant Design 6 · SCSS Modules · Vitest · Playwright

## Architecture

Feature-owned SPA: `src/app/` (shell, routing, store, base API), `src/features/` (auth, backlog, clients, dashboard, onboarding, projects, refinement, settings, viewer, and more), `src/shared/` (layout, pages, hooks, UI primitives), `src/resources/` (static configuration). Route guards enforce public, guest, authenticated, and role-based access.

Full reference: [docs/architecture/overview.md](docs/architecture/overview.md) · [docs/README.md](docs/README.md)

## Getting started

Requires Node.js 22 (the CI version, see `.nvmrc`; Vite 7 needs at least 20.19) and a running [Open Projects Hub API](https://github.com/alonsovndev/open-projects-hub-api).

```bash
git clone https://github.com/alonsovndev/open-projects-hub-web.git
cd open-projects-hub-web
cp .env.example .env   # API defaults to http://localhost:8000
npm install
npm run dev          # http://localhost:5173
```

With the API in Docker (port 8080), set `VITE_API_BASE_URL=http://localhost:8080` in `.env`. To sign in locally, either create an administrator without email (`make seed-admin` in the API repository) or register in the app, which needs working SMTP settings in the API so the verification code is delivered.

## Configuration

| Variable            | Used for                                               | Notes                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | API origin the browser calls and the CSP `connect-src` | Origin only (no path). Read at build time: `.env` for local work (`http://localhost:8000`), the tracked `.env.production` for production (`https://api-oph.alonsovndev.com`) |

## Deploy

The app is a static build served by Cloudflare Workers (`wrangler.jsonc` serves `dist` with single-page-app routing) at https://oph.alonsovndev.com. Cloudflare Builds runs `npm run build` and `npx wrangler deploy` on `main`; the API URL is baked in at build time, and the API must allow this origin with credentials. Details and the CORS requirements: [docs/api/integration-guide.md](docs/api/integration-guide.md). Rollback: redeploy a previous build from the Cloudflare dashboard or revert the merge commit on `main`.

| Command                                 | Purpose                                                                                                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`                        | Lint, tests, type-check, and build                                                                                                                         |
| `npm run test:run`                      | Unit tests once                                                                                                                                            |
| `npm run test:coverage`                 | Unit tests with a coverage report                                                                                                                          |
| `npm run test:e2e`                      | Playwright end-to-end tests: run `npx playwright install` once, and have a running API seeded with the user in `e2e/fixtures/test-users.ts`. Not run in CI |
| `npm run lint` / `npm run format:check` | Code quality                                                                                                                                               |

## Known limitations

- Browser sessions require the API's cookie-session contract; access tokens stay in memory and refresh tokens use an HttpOnly cookie. See [API integration](docs/api/integration-guide.md#authentication) for migration and deployment requirements.
- The `/backlog` page loads up to 100 stories (the API maximum per request) and filters them in the browser; there is no pagination yet.
- Stories cannot be reordered manually (FR-004-03 is deferred; see the requirements in the [documentation](https://oph-docs.alonsovndev.com)).
- E2E coverage is limited to the auth flows and a public backlog smoke test.

## Contributing and license

See the [contribution guide](https://github.com/alonsovndev/.github/blob/main/CONTRIBUTING.md) and the [security policy](https://github.com/alonsovndev/.github/blob/main/SECURITY.md). Release notes: [CHANGELOG.md](CHANGELOG.md). [MIT](LICENSE).
