# UI/UX Skills Registry

This directory contains specialized skills for UI/UX review, design system enforcement, and frontend quality assurance in Open Projects Hub.

## Skill Overview

| #   | Skill                        | Description                                  | Best Trigger                            |
| --- | ---------------------------- | -------------------------------------------- | --------------------------------------- |
| 1   | `ui-ux-reviewer`             | Overall UX and interface quality review      | New pages, redesigns, workflow reviews  |
| 2   | `design-system-guardian`     | Enforce DESIGN.md compliance, detect drift   | PR reviews, component creation          |
| 3   | `ant-design-architect`       | Proper Ant Design component usage            | New components, refactoring custom code |
| 4   | `responsive-design-reviewer` | Verify all breakpoints (320px-1440px+)       | Layout changes, new pages, pre-release  |
| 5   | `accessibility-reviewer`     | WCAG AA compliance verification              | Any UI change, pre-release              |
| 6   | `landing-page-expert`        | Marketing page and CTA optimization          | Home page, landing pages, sign-up flow  |
| 7   | `form-ux-expert`             | Form design, validation, and completion flow | New/modified forms                      |
| 8   | `dashboard-ux-expert`        | Admin panel and data-heavy page UX           | Dashboard, tables, metrics              |
| 9   | `css-modules-reviewer`       | SCSS maintainability and token usage         | New SCSS, refactoring, pre-release      |

## Using Skills

Skills are loaded via the `skill` tool when the task matches the description. Each skill contains:

- **SKILL.md** — Full instructions, checklist, and output format
- Supporting reference files (if applicable)

## Automation Triggers

See `.opencode/workflows/` for automated skill trigger configurations.

## Design System Source of Truth

All skills reference `DESIGN.md` (project root) as the primary source of truth for design decisions. Secondary references:

| File                            | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `src/styles/variables.scss`     | SCSS token variables               |
| `src/styles/global.scss`        | CSS custom properties (light/dark) |
| `src/styles/animations.scss`    | Keyframe animations                |
| `src/app/theme/theme-tokens.ts` | Ant Design ThemeConfig             |
