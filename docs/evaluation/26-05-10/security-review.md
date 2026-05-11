# Security Review — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Score: 5 / 10 (→ unchanged from v1)

The most significant security risk — JWT token storage in `localStorage` — has
not changed since the April 30 audit. Static analysis tooling is now in place,
which prevents new classes of vulnerabilities from being introduced silently.
The overall score is held at 5 because the highest-severity finding is still
open.

---

## Findings

### Critical

#### CRIT-01: JWT Token in `localStorage` (XSS-readable)

**File:** `src/features/auth/model/session-storage.ts`

```ts
localStorage.setItem(adminAuthConfig.sessionStorageKey, JSON.stringify(session));
```

The full `AdminSession` object — including `token` — is written to
`localStorage`. Any JavaScript that executes on the page (including injected
third-party scripts or XSS payloads) can read this value with
`localStorage.getItem(key)`.

**Impact:** A successful XSS attack results in full account takeover; the
attacker can exfiltrate the token and make authenticated API calls outside the
browser.

**Mitigation options (in ascending order of robustness):**

| Option | Description                                                                | Effort |
| ------ | -------------------------------------------------------------------------- | ------ |
| A      | Move to `sessionStorage` — cleared on tab close                            | Low    |
| B      | Store only a non-sensitive display-name in storage; use an in-memory token | Medium |
| C      | Replace with httpOnly cookie issued by the backend                         | High   |

Option B is recommended as the pragmatic middle ground: keep display-name and
role in `localStorage` for UX persistence; keep the bearer token in a React
context variable (in-memory, cleared on tab close).

#### CRIT-02: No Content Security Policy (CSP)

There is no CSP `<meta>` tag in `index.html` and no evidence of
`Content-Security-Policy` HTTP response headers being set. Without a CSP:

- Injected `<script>` tags execute without restriction.
- `eval()` and inline event handlers are unrestricted.

**Mitigation:** Add a CSP header at the CDN / reverse-proxy layer. As a
minimum, include `default-src 'self'; script-src 'self'` and add specific
exceptions only as required.

---

### High

#### HIGH-01: `base-api.ts` Reads Token Directly from `localStorage`

**File:** `src/app/api/base-api.ts` (lines 11–22)

The RTK Query `prepareHeaders` function reads the session from
`window.localStorage` on every API call. This is a second direct coupling to
`localStorage` (in addition to `session-storage.ts`). If the token storage
mechanism changes, both files must be updated.

**Mitigation:** Expose the token via a Redux selector and read it from state
inside `prepareHeaders` using the `api.getState()` parameter that RTK Query
provides.

#### HIGH-02: No CSRF Protection

The app sends `Authorization: Bearer <token>` headers, which are not
automatically included by the browser in cross-origin requests (unlike
cookies). This means the current architecture is not vulnerable to CSRF in the
traditional sense. **However**, if token storage is moved to cookies (see
CRIT-01 mitigation option C), CSRF protection must be added simultaneously
(e.g., via the SameSite cookie attribute and a CSRF token header).

---

### Medium

#### MED-01: `console.error` Logs Session Errors to Browser Console

**File:** `src/features/auth/model/session-storage.ts` (lines 9, 18, 27)

Session-related errors are logged with `console.error`. In a production
browser DevTools console, these messages may reveal internal session structure
or storage key names to an attacker with physical access to the machine.

**Mitigation:** Gate session-error logging behind `isDev` (already imported
from `@/config/env`), or use a structured logger that ships to a
backend-only endpoint in production.

#### MED-02: No HTTP Strict Transport Security (HSTS)

HSTS must be configured at the server / CDN level. This is an infrastructure
concern, but the development team should verify it is enabled in the production
deployment before going live.

#### MED-03: Zod Environment Validation Throws in Tests

**File:** `src/config/env.ts`

`validateEnv()` is called at module load time and throws if
`VITE_API_BASE_URL` is not set. In the test environment this causes all 8
test files to fail immediately. While not a direct security issue, the pattern
of throwing at import-time makes the app harder to test in isolation, which
indirectly reduces security test coverage.

---

### Low

#### LOW-01: No Subresource Integrity (SRI) for External Resources

`index.html` does not load any external scripts at present, so SRI is not
currently needed. This note is a reminder to add `integrity` attributes if any
CDN-hosted scripts or fonts are added in the future.

#### LOW-02: No `npm audit` in CI

`npm audit` reports known vulnerabilities in dependencies. There is no
evidence of an automated audit step in the GitHub Actions workflow.

---

## Dependency Vulnerability Status

`npm audit` should be run and its output reviewed:

```
npm audit
```

Address any `high` or `critical` severity findings before the next release.

---

## Recommendations (Priority Order)

1. **[CRIT-01]** Move the JWT token out of `localStorage`. Implement option B
   (in-memory token + localStorage non-sensitive display data) as the
   near-term fix.
2. **[CRIT-02]** Add a Content Security Policy at the CDN/proxy layer.
3. **[HIGH-01]** Read the token from Redux state in `prepareHeaders` instead
   of reading `localStorage` directly.
4. **[MED-01]** Gate `console.error` in `session-storage.ts` behind `isDev`.
5. **Add `npm audit --audit-level=high`** to the CI pipeline to catch
   dependency vulnerabilities before merge.
