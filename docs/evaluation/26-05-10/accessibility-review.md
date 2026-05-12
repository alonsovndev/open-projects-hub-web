# Accessibility Review — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Score: 6 / 10 (↑ from 5.5 in v1)

The `eslint-plugin-jsx-a11y` rules are now wired into the ESLint config,
which means new violations will be caught at the linting stage. Ant Design 6
provides reasonable built-in accessibility for its form and interactive
components. However, aria coverage is still shallow: only 6 source files
contain explicit `aria-*` attributes, and no automated WCAG audit has been
run.

---

## Static Analysis Coverage

### ESLint jsx-a11y Rules Enabled

| Rule                                      | Level |
| ----------------------------------------- | ----- |
| `jsx-a11y/alt-text`                       | warn  |
| `jsx-a11y/anchor-is-valid`                | warn  |
| `jsx-a11y/click-events-have-key-events`   | warn  |
| `jsx-a11y/no-static-element-interactions` | warn  |

All four rules are set to `warn`, meaning they will not fail the lint gate.
Raising them to `error` would enforce compliance for new code.

### Files with Explicit `aria-*` Attributes

| File                                                                   | Attributes Used |
| ---------------------------------------------------------------------- | --------------- |
| `features/auth/components/admin-login-form/AdminLoginForm.tsx`         | `aria-invalid`  |
| `features/auth/components/forgot-password-form/ForgotPasswordForm.tsx` | `aria-invalid`  |
| `features/auth/components/reset-password-form/ResetPasswordForm.tsx`   | `aria-invalid`  |
| `features/auth/components/register-form/RegisterForm.tsx`              | `aria-invalid`  |
| `features/dashboard/components/admin-welcome/AdminWelcome.tsx`         | `aria-label`    |
| `shared/components/layout/app-header/AppHeader.tsx`                    | `aria-label`    |

Auth forms use `aria-invalid` on Ant Design form inputs — this is the correct
pattern for communicating validation state to screen readers.

---

## Ant Design Accessibility Baseline

Ant Design 6 components that are used in this project include built-in keyboard
navigation and ARIA roles:

| Component        | Built-in A11y                                               |
| ---------------- | ----------------------------------------------------------- |
| `Form` / `Input` | Labels linkable via `name`, `aria-required`, `aria-invalid` |
| `Button`         | `role="button"`, keyboard activatable                       |
| `Select`         | `role="combobox"`, arrow-key navigation                     |
| `Table`          | `role="grid"`, sortable column headers                      |
| `Modal`          | Focus trap, `role="dialog"`, `aria-modal`                   |
| `Menu`           | `role="menu"`, keyboard navigation                          |

The codebase benefits from these defaults for free. However, custom
interactive elements (DnD in backlog) may not inherit these roles.

---

## Issues

### High

1. **DnD backlog board has no keyboard accessibility** — `@dnd-kit` provides
   keyboard support but it must be explicitly wired. `BacklogBoard`,
   `BacklogColumn`, and `StoryCard` do not appear to configure the keyboard
   sensor or announce drag state to screen readers.

### Medium

2. **No `aria-live` region for toast / notification messages** — Ant Design's
   `notification` and `message` APIs trigger ephemeral UI; these should be
   announced via an `aria-live="polite"` region for screen reader users.

3. **`ErrorBoundary` fallback uses `<div>` container** with no `role` —
   the error fallback UI should use `role="alert"` or `aria-live="assertive"`.

4. **Page `<title>` is static** — the HTML `<title>` does not update when the
   route changes. Screen reader users depend on the page title to identify the
   current page after navigation.

### Low

5. **`jsx-a11y` rules are `warn`, not `error`** — violations are visible in
   the lint output but do not block the pre-commit hook or CI.

6. **No colour-contrast audit** — the Ant Design theme tokens have not been
   verified for WCAG AA contrast compliance with the custom colour values (if
   any) used in this project.

7. **`RouteLoading` spinner** — the loading skeleton/spinner shown during
   route hydration should have an `aria-label` or `role="status"` to announce
   the loading state.

---

## Recommendations

1. **Raise `jsx-a11y` rules to `error`** for `alt-text` and
   `anchor-is-valid` at minimum.
2. **Add keyboard sensor to `@dnd-kit`** in `BacklogBoard` and wire
   `announcements` via `DndContext`'s `accessibility` prop.
3. **Set document `<title>` per route** — use a React `useEffect` or a
   `<Helmet>` equivalent that updates `document.title` on navigation.
4. **Add `role="alert"` to `ErrorBoundary` fallback** so screen readers
   announce the error automatically.
5. **Run an automated WCAG 2.1 AA audit** using `axe-core` (available via
   `@axe-core/playwright` for E2E) and address all violations before the
   next release.
