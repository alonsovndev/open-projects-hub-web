# Changelog

All notable changes to the web app are recorded here. Versions will be the `vX.Y.Z` tags on `main`; the format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

No release tag exists yet (TBD: `v0.1.0` on `main`). The app is already deployed by Cloudflare Builds from `main` at https://oph.alonsovndev.com.

### Added

- Self-service sign-up with an emailed verification code, login, password reset and cookie-based browser sessions (access token in memory, refresh token in an HttpOnly cookie).
- Clients, projects, archive and reactivate, team management, settings with AI credits and provider keys, and a dashboard.
- AI-assisted refinement of requirement notes into user stories, with explicit approval before anything is stored.
- Approved-backlog view with Markdown export, and the account-free Client Review page at `/viewer/:accessCode`.
- Cloudflare Workers static hosting (`wrangler.jsonc`) and a production build that calls the API at `https://api-oph.alonsovndev.com`.
- CI that runs `npm run verify` (lint, unit tests, type-check, build) on pull requests and on pushes to `dev` and `main`.

### Fixed

- A time-of-day collision made the resend-expiry test in the verify-email form fail depending on the clock; the test now pins the date.

[Unreleased]: https://github.com/alonsovndev/open-projects-hub-web/commits/main
