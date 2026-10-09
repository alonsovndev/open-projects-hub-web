# API Integration Guide

How the web app talks to `open-projects-hub-api`. The API's own reference
(`open-projects-hub-api/docs/api/README.md` and the generated `docs/api/openapi.json`) is the
source of truth for request and response shapes.

## Base Configuration

- `VITE_API_BASE_URL` sets the API origin (for example `http://127.0.0.1:8000`). It must be an
  origin only, with no path, because `index.html` also uses it as the CSP `connect-src`.
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

- The access token lives only in Redux state (`state.auth.session.token`) and is attached as
  `Authorization: Bearer <token>` by `base-api.ts`.
- The refresh token is persisted (session storage, or local storage with "remember me") so a
  reload can resume the session. On boot, `useSessionBootstrap` exchanges it once for a new
  token pair.
- A `401` on a normal request triggers one shared silent refresh and a retry; if the refresh
  fails, the session is cleared.
- Requests to `/v1/viewer/` never carry a token, so the Client Review page behaves the same for
  signed-in and anonymous visitors.

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
`src/mocks/handlers/`). The running app always talks to the real API; Playwright E2E tests need
a running, seeded backend (see `e2e/fixtures/test-users.ts`).
