# Changelog

All notable changes to the web app are recorded here. Versions are the `vX.Y.Z` tags on `main`; the format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [0.3.0] - 2026-10-27

### Added

- First-use welcome for workspace administrators, shown on the dashboard until dismissed, with a "Reset onboarding" control in Settings (F-005). It needs API `v0.2.0`.
- A hint to check the spam folder next to emailed verification and reset codes.
- A locked-out sign-in now says the account is temporarily locked and when to try again, instead of the generic rate-limit message (FR-007-04).

### Changed

- The landing page's "Get Started" is now "Create Account" and opens `/register` directly from the header, hero and closing section (FR-006-02). `/role-selection` is still routable but no longer linked from the landing page; clients use "Enter Access Code".

### Fixed

- Backlog search input sizing.

## [0.2.0] - 2026-10-19

### Added

- Optional Sentry browser error tracking, enabled only when `VITE_SENTRY_DSN` is set. Personal data, cookies, headers, request bodies and URL query strings are not collected, and trace headers are not sent to the API.
- Render errors, uncaught React errors and unexpected API failures (server errors, network and parsing failures, invalid session responses) are reported. API events carry only the endpoint template and status.
- Known browser and deploy noise is filtered out: `ResizeObserver` loops, aborted requests, lazy-chunk load failures after a deploy and browser-extension scripts.

### Changed

- Documentation links point to the new domain.

## [0.1.0] - 2026-10-19

First release. The app is deployed by Cloudflare Builds from `main` at https://oph.alonsovndev.com.

### Added

- Self-service sign-up with an emailed verification code, login, password reset and cookie-based browser sessions (access token in memory, refresh token in an HttpOnly cookie).
- Clients, projects, archive and reactivate, team management, settings with AI credits and provider keys, and a dashboard.
- AI-assisted refinement of requirement notes into user stories, with explicit approval before anything is stored.
- Approved-backlog view with Markdown export, and the account-free Client Review page at `/viewer/:accessCode`.
- Cloudflare Workers static hosting (`wrangler.jsonc`) and a production build that calls the API at `https://api-oph.alonsovndev.com`.
- CI that runs `npm run verify` (lint, unit tests, type-check, build) on pull requests and on pushes to `dev` and `main`.

### Fixed

- A time-of-day collision made the resend-expiry test in the verify-email form fail depending on the clock; the test now pins the date.

[Unreleased]: https://github.com/alonsovndev/open-projects-hub-web/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/alonsovndev/open-projects-hub-web/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/alonsovndev/open-projects-hub-web/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/alonsovndev/open-projects-hub-web/releases/tag/v0.1.0
