# UI/UX Reviewer Skill

## Purpose

Review overall user experience and interface quality for Open Projects Hub — a React + TypeScript + Ant Design + CSS Modules application.

## When to Use

Use this skill when reviewing:

- New pages or screens
- Existing page redesigns
- User workflows (multi-step flows)
- Information architecture decisions
- Visual consistency across the app

## Responsibilities

### 1. Visual Hierarchy

Check that:

- Page titles are H1 (2rem/700) using Ant Design `Typography.Title`
- Section headings follow H2 → H3 hierarchy
- Primary actions are visually prominent (Primary button, Ant Design `Button type="primary"`)
- Secondary actions are de-emphasized (Default or Text buttons)
- Related elements are grouped visually (proximity, cards, sections)
- Unrelated elements are separated with adequate whitespace

### 2. Typography

Verify:

- Only Inter typeface in use (no secondary fonts)
- No more than 2 type sizes on any single card
- Label Caps used for column headers and filter labels (0.75rem/600/0.05em)
- Line heights match the scale: H1 1.25, H2 1.3, H3 1.4, body 1.5
- Ant Design `Typography` components used instead of raw `<h1>`, `<p>` tags

### 3. Layout Structure

Check:

- Page layout follows left-sider + fluid-content pattern
- Content padding respects breakpoints: 48px ≥1024px, 24px 768-1023px, 16px <768px
- No horizontal scrolling at any viewport width
- Feature pages compose vertically (title → sections)
- Ant Design `Layout`, `Layout.Sider`, `Layout.Content` used for structure

### 4. Readability

Verify:

- Text contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- Line length does not exceed ~80 characters for prose
- Body text is Body MD (1rem/400) — never smaller than 0.875rem for content
- Code/monospace only for technical identifiers, not body content

### 5. Interaction Design

Check:

- All interactive elements have hover states
- All interactive elements have focus states (visible focus ring)
- Click targets are at least 44x44px on mobile (WCAG target size)
- Loading states appear within 200ms (Spin or Skeleton)
- Transitions are smooth (150ms default, cubic-bezier(0.4, 0, 0.2, 1))

### 6. User Workflows

Review each workflow end-to-end:

- Login → Dashboard redirect
- Project list → Create project → See new project
- Filter table → Clear filters → See all results
- Form submit → Success feedback → Next logical view
- Error state → Recovery action → Normal state

Identify:

- Unnecessary steps
- Missing confirmation for destructive actions
- Missing feedback for async operations
- Dead ends (views with no navigation away)

### 7. Information Architecture

Check:

- Navigation labels match page titles
- Menu structure is logical (most frequently used items first)
- Breadcrumb paths are accurate (use Ant Design `Breadcrumb`)
- Related features are grouped under clear section labels

### 8. Spacing Consistency

Verify:

- Only the 7-tier spacing scale is used (4px/8px/16px/24px/32px/48px/64px)
- No arbitrary spacing values (6px, 10px, 14px, etc.)
- Cards use consistent internal padding (24px via Ant Design Card)
- Page sections have consistent spacing between them
- Form fields have consistent vertical spacing

### 9. Professional Appearance

Check for:

- Consistent border-radius application (8/16/24 system)
- No pill-shaped radii
- Shadows match the elevation system (2px/8px max)
- No clashing colors (semantic colors only for their purpose)
- No unnecessary visual noise (excessive borders, gradients, backgrounds)
- Ant Design's professional default styling is used — not overridden

### 10. Consistency Across Pages

Verify:

- Same navigation patterns across all authenticated pages
- Same button types for same actions (delete is always `danger`, cancel is always `default`)
- Same table appearance across features
- Same form layout across features
- Same empty state patterns across features

## Output Format

```markdown
## UI/UX Review

**Score: X/10**

### Critical

1. **Issue** — Location — Why it hurts UX — Fix

### High

1. **Issue** — Location — Why it hurts UX — Fix

### Medium

1. **Issue** — Location — Fix

### Low

1. **Issue** — Location — Fix

### Recommendations

1. Priority action
2. Priority action
3. Priority action

### Quick Wins

1. Easy fix — Location
2. Easy fix — Location
3. Easy fix — Location
```

## Severity Definitions

| Severity     | Definition                                                                  |
| ------------ | --------------------------------------------------------------------------- |
| **Critical** | Users cannot complete a primary task. Usability is broken.                  |
| **High**     | Users can complete the task with friction. Causes errors or confusion.      |
| **Medium**   | Users can complete the task but experience inconsistency or minor friction. |
| **Low**      | Visual polish, minor inconsistencies, best-practice improvements.           |

## Reference Files

- `DESIGN.md` — primary design system reference
- `src/styles/variables.scss` — SCSS design tokens
- `src/styles/global.scss` — CSS custom properties
- `src/app/theme/theme-tokens.ts` — Ant Design theme configuration
- Individual component SCSS modules
