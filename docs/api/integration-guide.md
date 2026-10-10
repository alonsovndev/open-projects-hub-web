# API Integration Guide

How the web app talks to `open-projects-hub-api`. The API's own reference
(`open-projects-hub-api/docs/api/README.md` and the generated `docs/api/openapi.json`) is the
source of truth for request and response shapes.

## Base Configuration

- `VITE_API_BASE_URL` sets the API origin (for example `http://localhost:8000`). Use an origin
  without a path. For a loopback API, Vite proxies `/v1` to that origin and the browser uses
  its own origin. This avoids cross-origin cookie handling and hostname
  mismatches when an existing `.env` uses `127.0.0.1`. The CSP permits the same origin.
- Production defaults to the page's origin. Deploy the web and `/v1/*` API through the same
  HTTPS origin; `.env.production` leaves the URL empty. A deployment override must also be
  reflected in API CORS and trusted session origins.
- Every endpoint is defined with RTK Query on top of `src/app/api/base-api.ts`; each feature
  injects its own endpoints from `src/features/<feature>/api/`.
- Backend responses are mapped to the frontend domain types in `transformResponse`, so
  components never see transport shapes.

## Endpoints Used by the Web App

All paths are under `/v1`.

| Feature       | Module                                      | Calls                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth          | `features/auth/api/admin-auth-api.ts`       | `POST /auth/login`, `/auth/register`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/resend-reset-code`, `/auth/logout`                                |
| Projects      | `features/projects/api/projects-api.ts`     | `GET /projects` (`offset`, `limit`, `status`, `clientId`, `search`, `createdFrom`, `createdTo`); `GET`, `PATCH`, `DELETE /projects/{id}`; `POST /projects`; `POST /projects/{id}/archive`, `/reactivate`, `/access-code/regenerate` |
| Backlog       | `features/backlog/api/backlog-api.ts`       | `GET /projects/{id}/backlog`; `POST /projects/{id}/exports/markdown`                                                                                                                                                                |
| Stories       | `features/backlog/api/stories-api.ts`       | `GET /stories` (`project_id`, `priority`); `DELETE /stories/{id}`                                                                                                                                                                   |
| Clients       | `features/clients/api/clients-api.ts`       | `GET /clients`; `POST /clients`; `PATCH`, `DELETE /clients/{id}`                                                                                                                                                                    |
| Dashboard     | `features/projects/api/projects-api.ts`     | `GET /dashboard/stats`                                                                                                                                                                                                              |
| Refinement    | `features/refinement/api/refinement-api.ts` | `POST /refinement/generate-stories`, `/refinement/approve-story`, `/refinement/approve-stories`                                                                                                                                     |
| Settings      | `features/settings/api/*.ts`                | `GET`, `PATCH /users/me/profile`; `POST /users/me/password`; `GET`, `POST /users`; `PATCH /users/{id}/status`; `DELETE /users/{id}`; `PATCH /workspaces/me`                                                                         |
| AI providers  | `features/settings/api/ai-providers-api.ts` | `GET /users/me/credits`; `GET`, `POST /users/me/api-keys`; `DELETE /users/me/api-keys/{provider}`; `POST /users/me/api-keys/{provider}/validate`                                                                                    |
| Client Review | `features/viewer/api/viewer-api.ts`         | `GET /viewer/{accessCode}` (public, sent without a token)                                                                                                                                                                           |

## Authentication

- The access token lives only in Redux (`state.auth.session.token`) and is attached as
  `Authorization: Bearer <token>` to protected data requests. Data requests omit cookies.
- Login, refresh and logout use `credentials: include` and `X-Session-Mode: cookie`.
  Refresh/logout have no credential body and no bearer header. The API owns the host-only
  `oph_refresh_token` cookie: HttpOnly, SameSite=Lax, Path=/v1/auth, and Secure outside local/test.
  Ordinary sessions use a session cookie; remember-me sessions persist for the server's
  remaining seven-day lifetime. Browser JSON contains access tokens and current
  user/workspace metadata, never refresh tokens.
- Bootstrap, automatic refresh and explicit extension share one refresh per session.
  A protected `401` refreshes once and retries. Rejected refreshes or a second `401` clear
  the session and cache; transient refresh failures preserve the session for retry.
- Login attempts, logout, expiry and cross-tab changes clear RTK Query caches. Older
  responses cannot restore identities or supply private data. Web Locks serialize cookie
  writes across tabs; browsers without Web Locks have in-tab serialization only.
- Sign-out intent is persisted without credentials. Failed server logout is retried on
  reload instead of refreshing the surviving cookie. Only successful explicit login clears
  this intent. When storage is disabled, bootstrap fails closed and requires explicit sign-in.
- Old session/remember-me entries are deleted from both browser stores. Existing users
  sign in again once; deploy the coordinated API change before this web change.
- Requests to `/v1/viewer/` never carry a token or cookie.

### Deployment requirements

Configure the API's `FRONTEND_BASE_URL` or exact CORS origins to the deployed web origin.
Cookie operations reject missing, `null`, or untrusted `Origin` headers. Local mode also
accepts loopback origins on Vite fallback ports. Cross-origin development requires
`allow_credentials: true` and `X-Session-Mode` in allowed headers. Container/dev/prod cookie
mode requires HTTPS. Keep CloudFront `/v1/auth/*` caching disabled and forward cookies,
`Origin`, and `X-Session-Mode`; concrete deployment configuration is TBD and is not changed
by this patch. Auth responses carry `Cache-Control: no-store`.

### AI draft boundaries

Generated responses and restored drafts are runtime-validated. Unknown fields are removed;
malformed story content keeps the user's notes available for retry. Approval sends only
title, description and acceptance criteria, plus the project captured when generation
started. AI text cannot override project, owner, status or other request metadata. Output
remains text and requires human approval. This boundary does not guarantee that a model
will ignore prompt injections; authorization and provider-side controls remain API duties.

## Error Handling

The API returns errors as `{ "detail": "<message>" }`, sometimes with a `code`
(`EMAIL_NOT_VERIFIED`, `INSUFFICIENT_CREDITS`) or provider-key fields (`provider`, `reason`,
`promptsKeyUpdate`). `base-api.ts` normalizes these into a single error shape; rate-limited
responses (`429`) use `{ "error": "..." }` instead.

## Cache Invalidation

Tag types are declared in `base-api.ts`: `AdminAuth`, `Projects`, `Clients`, `DashboardStats`,
`Stories`, `Backlog`, `UserProfile`, `AiProviderKeys`, `CreditBalance`, `TeamMembers`.
Mutations invalidate the tags of every view they affect; for example deleting a story
invalidates `Stories`, `Backlog`, and `DashboardStats`.

## Testing

Unit and integration tests mock the API with MSW (`src/mocks/server.ts` and
`src/mocks/handlers/`). The running app always talks to the real API. The security browser tests in
`e2e/security-session.spec.ts` serve the UI and a cookie API fixture on one local HTTP
origin and need no backend. Other
Playwright E2E tests may need a seeded backend (see `e2e/fixtures/test-users.ts`).
