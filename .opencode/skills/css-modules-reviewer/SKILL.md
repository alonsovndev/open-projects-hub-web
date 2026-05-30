# CSS Modules Reviewer Skill

## Purpose

Ensure maintainable, consistent CSS Modules architecture in Open Projects Hub — a React + TypeScript + Vite + Sass application.

## When to Use

Use this skill when:

- Creating new SCSS module files
- Reviewing existing SCSS modules
- Refactoring styles
- Debugging styling issues
- Before any release

## Review Checklist

### 1. Naming Convention

- [ ] Classes use kebab-case (`.page-container`, `.card-title`)
- [ ] Modifier classes use double-hyphen (`.button--primary`, `.card--compact`)
- [ ] State classes use is-/has- prefix (`.is-active`, `.has-error`, `.is-loading`)
- [ ] No camelCase class names in SCSS (CSS Modules scopes kebab-case fine)
- [ ] No BEM — CSS Modules provide scoping, simple kebab-case is sufficient
- [ ] Class names describe visual purpose (`.search-input`), not appearance (`.blue-box`)

### 2. Variables Import

- [ ] Every SCSS module imports design tokens: `@use "@/styles/variables.scss" as *;`
- [ ] No hardcoded values when a variable exists:

  ```scss
  // ❌ BAD
  padding: 24px;
  color: #0057c2;
  border-radius: 8px;

  // ✅ GOOD
  padding: $spacing-lg;
  color: $primary-base;
  border-radius: $radius-sm;
  ```

- [ ] No variable overrides or redefinitions in component SCSS
- [ ] No imports of other SCSS files beyond `variables.scss`

### 3. Hardcoded Values Detection

Search for these patterns:

| Hardcoded Pattern                                 | Variable Alternative                     |
| ------------------------------------------------- | ---------------------------------------- |
| `color: #...`                                     | `$primary-base`, `$text-primary`, etc.   |
| `background: #...` or `background-color: #...`    | `$surface-white`, `$surface-light`, etc. |
| `padding: Npx` (N outside 4/8/16/24/32/48/64)     | `$spacing-*`                             |
| `margin: Npx` (N outside 4/8/16/24/32/48/64)      | `$spacing-*`                             |
| `gap: Npx` (N outside 4/8/16/24/32/48/64)         | `$spacing-*`                             |
| `border-radius: Npx` (N outside 8/16/24)          | `$radius-*`                              |
| `font-size: Nrem` (N outside type scale)          | Type scale values                        |
| `box-shadow: ...` (not matching elevation system) | Elevation reference                      |
| `@media (max-width: Npx)`                         | `$breakpoint-*`                          |

### 4. Duplicated Styles

- [ ] Same style patterns repeated across multiple SCSS modules
- [ ] Similar component styles that should share a mixin
- [ ] Ant Design overrides duplicated across files (should be in one place)
- [ ] Animation keyframes duplicated (should be in `animations.scss`)

### 5. Unused Styles

- [ ] No orphaned CSS classes (defined but never referenced in JSX)
- [ ] No commented-out style blocks
- [ ] No dead code from refactoring (old class names still in CSS)

### 6. Excessive Nesting

- [ ] Maximum nesting depth: 4 levels

  ```scss
  // ❌ BAD — 6 levels deep
  .page {
    .section {
      .card {
        .content {
          .title {
            span { ... }
          }
        }
      }
    }
  }

  // ✅ GOOD — 3 levels
  .card {
    .content { ... }
    .title { ... }
    .title span { ... }
  }
  ```

- [ ] No unnecessary nesting of single selectors
- [ ] `:global(.ant-*)` overrides are minimized and flat (not deeply nested)

### 7. Global CSS Leakage

- [ ] All component styles use `.module.scss` extension (CSS Modules)
- [ ] No global class name pollution from component files
- [ ] Global styles only in `src/styles/global.scss` and `src/styles/animations.scss`
- [ ] No `:global` blocks except for Ant Design overrides
- [ ] No bare element selectors in module files (`.page { ... }` is fine, `div { ... }` is not)

### 8. Specificity Issues

- [ ] No `!important` annotations in module files
- [ ] If `!important` exists, it has an inline comment explaining why
- [ ] No ID selectors in SCSS files (`#my-component` — use classes)
- [ ] Ant Design overrides use `:global(.ant-*)` with specific selectors (not catch-all)

### 9. Responsiveness

- [ ] Media queries use `$breakpoint-*` variables:

  ```scss
  // ✅ GOOD
  @media (max-width: $breakpoint-tablet) { ... }

  // ❌ BAD
  @media (max-width: 768px) { ... }
  ```

- [ ] Mobile-first approach preferred (min-width queries)
- [ ] Media queries at the component level (not a separate file)
- [ ] No duplicate breakpoint logic across modules

### 10. Design Token Usage

- [ ] All property values reference design token variables
- [ ] Color values: `$primary-base`, `$surface-white`, `$text-primary`, etc.
- [ ] Spacing values: `$spacing-*`
- [ ] Radius values: `$radius-*`
- [ ] Font values: `$font-headline`, `$font-body`
- [ ] Breakpoint values: `$breakpoint-*`

### 11. CSS Module File Organization

- [ ] One `.module.scss` per component, in the component's directory
- [ ] One `.module.scss` per page, in the page's directory
- [ ] File name matches component/page name in kebab-case
- [ ] No SCSS files outside of component/page directories (except `src/styles/`)

## Common Anti-Patterns

```scss
// ❌ ANTI-PATTERN 1: Deep nesting for Ant Design overrides
.card {
  :global {
    .ant-card-body {
      .ant-form {
        .ant-form-item { ... }
      }
    }
  }
}

// ✅ BETTER: Flat override
.card {
  :global(.ant-card-body) { ... }
}
.antFormItem {
  :global(.ant-form-item) { ... }
}
```

```scss
// ❌ ANTI-PATTERN 2: Hardcoded values
padding: 20px; // Should be $spacing-lg
color: #333; // Should be $text-primary
gap: 12px; // Should be $spacing-sm or $spacing-md

// ✅ CORRECT
padding: $spacing-lg;
color: $text-primary;
gap: $spacing-sm;
```

```scss
// ❌ ANTI-PATTERN 3: !important
.colorOverride {
  color: $primary-base !important;
}

// ✅ BETTER: Increase specificity properly
.parentContainer .colorOverride {
  color: $primary-base;
}
```

## Output Format

```markdown
## CSS Modules Review

**Maintainability Score: X/10**

### Findings

| #   | Severity | File               | Line | Rule             | Issue                               |
| --- | -------- | ------------------ | ---- | ---------------- | ----------------------------------- |
| 1   | High     | `file.module.scss` | 12   | Hardcoded values | `color: #333` → use `$text-primary` |
| ... |          |                    |      |                  |                                     |

### Violations Summary

- Hardcoded values found: X
- Unused styles: X
- Excessive nesting (>4 levels): X
- `!important` usage: X
- Missing design token imports: X
- Duplicate styles: X

### Refactoring Opportunities

1. Extract shared Ant Design override pattern to a mixin
2. Remove unused class [name] from [file]
3. Replace hardcoded [value] with [$variable] in [file]

### Maintainability Recommendations

1. Add `@use "@/styles/variables.scss" as *;` to files missing it
2. Break deep nesting into flatter structure
3. Remove commented-out style blocks
4. Standardize naming to kebab-case

### Quick Wins

1. **File:line** — Replace `#0057c2` with `$primary-base`
2. **File:line** — Replace `24px` padding with `$spacing-lg`
3. **File:line** — Remove empty/duplicate class
```
