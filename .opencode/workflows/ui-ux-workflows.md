# UI/UX Automation Workflows

This file defines when each UI/UX skill should be triggered automatically during code generation.

## Workflow Triggers

### When a React component is created or modified

Trigger: Files matching `src/**/*.tsx` or `src/**/*.ts` (component files)

Skills to run:

1. `ant-design-architect` — Verify correct Ant Design component usage
2. `css-modules-reviewer` — If companion SCSS module exists
3. `ui-ux-reviewer` — For full page components

### When a CSS Module is created or modified

Trigger: Files matching `src/**/*.module.scss`

Skills to run:

1. `css-modules-reviewer` — Check naming, hardcoded values, tokens, nesting
2. `design-system-guardian` — Verify design token usage

### When a new page is created

Trigger: New files in `src/features/*/pages/`

Skills to run:

1. `responsive-design-reviewer` — Verify all breakpoints
2. `ui-ux-reviewer` — Visual hierarchy, layout, consistency
3. `accessibility-reviewer` — Landmarks, headings, focus
4. `ant-design-architect` — Proper Ant Design page patterns

### When a layout is modified

Trigger: Files in `src/app/layouts/`

Skills to run:

1. `responsive-design-reviewer` — Breakpoint behavior (critical)
2. `ui-ux-reviewer` — Navigation, structure, consistency
3. `accessibility-reviewer` — Navigation keyboard/screen reader

### When a form is created or modified

Trigger: Files matching `src/**/*form*` `src/**/form*` or containing `Form.Item`

Skills to run:

1. `form-ux-expert` — Validation, labels, error handling, completion flow
2. `accessibility-reviewer` — Labels, errors, keyboard navigation
3. `ant-design-architect` — Ant Design Form patterns

### When a dashboard/admin page is created

Trigger: New files in `src/features/dashboard/` or pages containing stat/metric cards

Skills to run:

1. `dashboard-ux-expert` — Metrics layout, navigation, data density
2. `responsive-design-reviewer` — Dashboard grid breakpoints
3. `ui-ux-reviewer` — Information architecture, readability

### When a landing/marketing page is created

Trigger: New files in `src/features/home/` or pages with hero sections

Skills to run:

1. `landing-page-expert` — CTA, conversion, social proof, value prop
2. `responsive-design-reviewer` — Hero, features grid, mobile layout
3. `accessibility-reviewer` — Focus, contrast, keyboard nav

### Before any release / PR merge

Trigger: All changed files since last release

Skills to run:

1. `design-system-guardian` — Full design system compliance
2. `accessibility-reviewer` — Full WCAG AA audit
3. `responsive-design-reviewer` — Full breakpoint audit
4. `css-modules-reviewer` — Full SCSS audit
5. `ui-ux-reviewer` — Overall UX consistency

## Running Skills Manually

```bash
# Load a skill during conversation
skill name="ui-ux-reviewer"

# Then run the review following the SKILL.md instructions
```

## Skill Combination Order

For comprehensive reviews, run skills in this order:

1. `design-system-guardian` — Check token/variable compliance first
2. `ant-design-architect` — Check component usage
3. `css-modules-reviewer` — Check SCSS quality
4. `accessibility-reviewer` — Check WCAG compliance
5. `responsive-design-reviewer` — Check breakpoints
6. `ui-ux-reviewer` — Overall UX (last, after issues are fixed)

For targeted reviews, run only the relevant skill.
