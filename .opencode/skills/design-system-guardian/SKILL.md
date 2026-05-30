# Design System Guardian Skill

## Purpose

Enforce consistency with DESIGN.md and prevent design system drift in Open Projects Hub.

## When to Use

Use this skill when:

- Reviewing pull requests with UI changes
- Adding new components to the codebase
- Modifying existing components (especially styles)
- Creating new pages or layouts
- Before any release or deployment

## Responsibilities

### 1. Detect Duplicated UI Patterns

Scan the codebase for:

- Multiple implementations of the same UI pattern (e.g., two different "card" styles)
- Repeated Ant Design wrappers that should be shared components
- Custom implementations of Ant Design components (e.g., building a custom modal instead of using `antd` `Modal`)
- Copy-pasted code blocks across features that should be extracted

### 2. Detect Inconsistent Styling

Check for:

- Different border-radius values than the 8/16/24 system
- Different box-shadow values than the elevation system
- Different spacing values than the 7-tier scale
- Different font sizes than the type scale
- Components using different patterns for the same purpose
- Inconsistent hover/active/selected states across similar components

### 3. Detect Hardcoded Values

Search for:

- Hardcoded hex color values in SCSS files (should use `$primary-base`, `var(--color-primary)`, etc.)
- Hardcoded pixel spacing (should use `$spacing-*` variables)
- Hardcoded border-radius (should use `$radius-*` variables)
- Hardcoded font-size (should use the type scale)
- Hardcoded box-shadow (should use the elevation system)
- Hardcoded breakpoint values (should use `$breakpoint-*` variables)

### 4. Detect Design System Violations

Check for:

- Colors outside the brand palette
- Custom semantic colors (use Ant Design's built-in)
- More than one primary color in a single view
- Surface colors used outside their intended purpose
- Text colors that don't match the text palette
- Using `!important` in SCSS modules (symptom of specificity issues)

### 5. Detect Repeated Component Implementations

Scan for:

- Similar component implementations across different features
- Components that do the same thing with different names
- Opportunities to extract shared components to `src/shared/components/`
- API patterns that differ across similar components (different prop names for the same behavior)

### 6. Promote Reusable Components

Recommend:

- Moving feature-specific components to shared when used in 2+ features
- Creating shared wrapper components for frequently-used Ant Design patterns
- Extracting common styling patterns into SCSS mixins
- Standardizing prop interfaces across similar components

### 7. Verify Token Usage

Check each token domain:

- **Color tokens**: Every `color` or `background-color` value references a variable
- **Spacing tokens**: Every `padding`, `margin`, `gap` value references a `$spacing-*` variable
- **Radius tokens**: Every `border-radius` references a `$radius-*` variable
- **Font tokens**: Every `font-family` references `$font-headline` or `$font-body`
- **Shadow tokens**: Every `box-shadow` follows the elevation system
- **Breakpoint tokens**: Every `@media` query uses `$breakpoint-*` variables

### 8. Three-Location Synchronization

Verify DESIGN.md, variables.scss, global.scss, and theme-tokens.ts are in sync:

- Same color values across all files
- Same spacing values across all files
- Same radius values across all files
- Same typography values across all files
- Any token change in one file is reflected in all others

## Detection Patterns

### Hardcoded Colors to Flag

```scss
// ❌ BAD — hardcoded
color: #0057c2;
background: #f9f9f9;
border: 1px solid #eee;

// ✅ GOOD — token reference
color: $primary-base;
background: $surface-light;
border: 1px solid $surface-base;
```

### Hardcoded Spacing to Flag

```scss
// ❌ BAD — hardcoded
padding: 12px;
margin: 20px 10px;
gap: 6px;

// ✅ GOOD — token reference
padding: $spacing-sm $spacing-md;
margin: $spacing-lg $spacing-sm;
gap: $spacing-xs;
```

## Output Format

```markdown
## Design System Guardian Report

**Score: X/10** (10 = full compliance)

### Violations

| #   | Severity | File                                   | Issue            | Token Required  |
| --- | -------- | -------------------------------------- | ---------------- | --------------- |
| 1   | High     | `src/features/x/component.module.scss` | Hardcoded `#eee` | `$surface-base` |
| ... |          |                                        |                  |                 |

### Refactoring Opportunities

1. **Duplicate pattern** — File A and File B both implement [pattern] — extract to shared
2. **Repeated component** — [Component] exists in 3 features — move to shared
3. **Ant Design override** — Custom [component] replaces Ant Design [component]

### Reusability Recommendations

1. Extract [pattern] to `src/shared/components/[name]/`
2. Create SCSS mixin for [repeated style pattern]
3. Standardize [prop] naming across [components]

### Checklist

- [ ] No hardcoded colors found
- [ ] No hardcoded spacing found
- [ ] No hardcoded radius found
- [ ] All colors reference design tokens
- [ ] All spacing references `$spacing-*` variables
- [ ] All radius references `$radius-*` variables
- [ ] No Ant Design components reimplemented
- [ ] No duplicate component patterns
- [ ] Design tokens synchronized across all 4 locations
- [ ] `!important` usage is justified and minimal
```
