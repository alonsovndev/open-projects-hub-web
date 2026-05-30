# Accessibility Reviewer Skill

## Purpose

Verify WCAG AA compliance for Open Projects Hub — a React + TypeScript + Ant Design + CSS Modules application.

## Target Standard

**WCAG 2.1 Level AA** — all interfaces must meet this standard.

## When to Use

Use this skill when:

- Reviewing any UI change
- Creating new pages or components
- Before every release
- When modifying focus management, keyboard navigation, or forms

## Review Checklist

### 1. Color Contrast (WCAG 1.4.3, 1.4.6)

Measure contrast ratios:

| Element                        | Required Ratio | Current Reference                                    |
| ------------------------------ | -------------- | ---------------------------------------------------- |
| Normal text                    | 4.5:1          | Text Primary on white: 14.9:1 ✅                     |
| Large text (18px/14px bold)    | 3:1            | —                                                    |
| UI components (borders, icons) | 3:1            | Surface Base on white: 1.3:1 ❌ (informational only) |
| Placeholder text               | ≥3:1           | Text Secondary: 5.4:1 ✅                             |

**Check:**

- [ ] Text Primary (#1a1a1a) on Surface White (#ffffff): 14.9:1 ✅
- [ ] Text Secondary (#666666) on Surface White (#ffffff): 5.4:1 ✅
- [ ] Primary (#0057c2) on Surface White (#ffffff): 6.3:1 ✅
- [ ] Text Primary on Surface Light (#f9f9f9): sufficient
- [ ] All interactive element borders meet 3:1 minimum
- [ ] Icon colors meet 3:1 minimum against their backgrounds
- [ ] Focus indicator meets 3:1 against adjacent colors
- [ ] Dark mode colors pass same ratios against dark backgrounds
- [ ] Error state (red) text passes 4.5:1 on its background
- [ ] Disabled text/controls meet reduced contrast but remain discernible

### 2. Focus States (WCAG 2.4.7)

- [ ] Every interactive element has a visible focus indicator
- [ ] Focus indicator is at least 2px thick
- [ ] Focus indicator contrast ratio is at least 3:1
- [ ] Focus ring is not removed with `outline: none` without alternative
- [ ] Custom components have programmatic focus management
- [ ] Ant Design's focus rings are used (primary blue outline)
- [ ] Focus order follows visual order (tabIndex only used intentionally)
- [ ] No focus traps (user can Tab out of modals, drawers, menus)

### 3. Keyboard Navigation (WCAS 2.1.1)

- [ ] All functionality reachable via keyboard (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Custom interactive elements have `role` and `tabIndex`
- [ ] Custom key handlers use appropriate keys (Enter/Space for buttons, Arrow keys for lists)
- [ ] Skip navigation link exists for screen readers (visually hidden, focusable on Tab)
- [ ] Modal/Drawer traps focus while open (Ant Design provides this)
- [ ] Escape key closes modals, drawers, dropdowns
- [ ] No keyboard traps (focus cannot get stuck)

### 4. Labels & ARIA (WCAG 4.1.2)

- [ ] Every form input has a visible `<label>` (Ant Design `Form.Item` `label` prop)
- [ ] Icon-only buttons have `aria-label` or visible tooltip
- [ ] Custom controls have appropriate `role` attributes
- [ ] ARIA attributes are used correctly (not just added)
- [ ] `aria-describedby` connects inputs to error messages
- [ ] Dynamic content uses `aria-live` regions
- [ ] Status messages use `role="status"` or `aria-live="polite"`
- [ ] Loading states announced via `aria-busy` or `role="alert"`
- [ ] Navigation uses `<nav>` or `role="navigation"`
- [ ] Main content uses `<main>` or `role="main"`

### 5. Semantic HTML (WCAG 1.3.1)

- [ ] Page uses `<header>`, `<main>`, `<footer>`, `<nav>` landmarks
- [ ] Headings use proper hierarchy (h1 → h2 → h3, no skipped levels)
- [ ] Buttons use `<button>` not `<div>` or `<span>` with onClick
- [ ] Links use `<a>` with `href` (not `<div>` with onClick)
- [ ] Lists use `<ul>`/`<ol>`/`<li>` (or Ant Design `List`)
- [ ] Tables for tabular data (Ant Design `Table`), not for layout
- [ ] Forms use `<form>` (Ant Design `Form` provides this)
- [ ] Ant Design components provide semantic HTML — verify they're not overridden

### 6. Screen Reader Compatibility

- [ ] Page has `<title>` that describes the page content
- [ ] Language set on `<html>` (`lang` attribute)
- [ ] Images have `alt` text (informative) or `alt=""` (decorative)
- [ ] Complex images (charts) have text alternatives
- [ ] Empty states are announced to screen readers
- [ ] Error messages are programmatically associated with inputs
- [ ] Success messages are announced
- [ ] Loading states are announced (use `aria-busy` or `role="status"`)
- [ ] Modal/Drawer focus is trapped and announced when opened

### 7. Form Accessibility (WCAG 3.3.2)

- [ ] Required fields are visually indicated (Ant Design asterisk)
- [ ] Error messages are associated with inputs (`aria-describedby` or `aria-errormessage`)
- [ ] Error identification: describe what's wrong, suggest correction
- [ ] Form instructions available before the form
- [ ] Auto-fill is enabled for appropriate fields (`autocomplete` attribute)
- [ ] Tab order through form follows visual order
- [ ] Submit button is clearly labeled
- [ ] Success feedback after form submission
- [ ] Form validation errors do not remove previously entered values

### 8. Reduced Motion (WCAG 2.3.3)

- [ ] All animations respect `@media (prefers-reduced-motion: reduce)`
- [ ] No essential information conveyed through animation alone
- [ ] No flashing content (3+ flashes per second)
- [ ] `animations.scss` already includes reduced-motion media query — verify new animations use it
- [ ] Consider non-animated alternatives for critical interactions

### 9. Touch Targets (WCAG 2.5.8 / 2.5.5)

- [ ] Touch targets on mobile are at least 44x44px
- [ ] No small clickable elements (close buttons, icon buttons below 44px)
- [ ] Sufficient spacing between touch targets (at least 8px)
- [ ] Menus and dropdown items have adequate spacing

### 10. Common Ant Design Accessibility

Ant Design v6 provides accessibility by default:

- `Form` labels → associated with inputs automatically
- `Button` → semantic `<button>` element
- `Modal` → focus trap, Escape to close, ARIA attributes
- `Table` → proper table semantics
- `Menu` → proper navigation semantics
- `Select` → combobox pattern with ARIA
- `Tooltip` → accessible on focus

**Check**: Are these being bypassed? (e.g., custom onClick on a div instead of Button)

## Output Format

```markdown
## Accessibility Review

**Score: X/10**

### Critical (Must Fix — WCAG Failure)

1. **Issue** — WCAG SC — Location — Why it fails — Remediation

### High (Should Fix — Significant Barrier)

1. **Issue** — WCAG SC — Location — Why it fails — Remediation

### Medium (Fix When Possible)

1. **Issue** — Location — Remediation

### Low (Best Practice)

1. **Issue** — Location — Remediation

### Remediation Summary

| Issue | WCAG SC | Effort | Impact | Recommended Fix |
| ----- | ------- | ------ | ------ | --------------- |
| ...   |         |        |        |                 |

### Quick Wins

1. Add `aria-label` to icon button — File:line
2. Fix heading hierarchy — File
3. Add focus style to custom component — File
```

## Accessibility Testing Tools

For manual verification:

1. **axe DevTools** (browser extension) — automated scan
2. **Chrome DevTools** → Lighthouse → Accessibility audit
3. **Keyboard-only testing** — Tab through every interactive element
4. **Screen reader testing** — VoiceOver (macOS) or NVDA (Windows)
5. **Color contrast analyzer** — for manual ratio verification
