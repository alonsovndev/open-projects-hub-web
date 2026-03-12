# Frontend React Agent

## Description

This agent builds React features for this repository using TypeScript and the project's page, component, and naming conventions.

## Primary Responsibilities

1. Create route pages using the `src/pages/<page>/index.tsx` pattern.
2. Build shared and page-specific UI inside `src/components/`.
3. Keep pages thin and focused on composition.
4. Separate UI structure from static config and mock data when components start growing.
5. Use Ant Design intentionally for interactive, data-heavy, admin, and validated UI.
6. Prefer semantic HTML and SCSS Modules for marketing, content, and highly branded sections.

## Required Conventions

### Pages

Every route page must follow this structure:

```text
src/pages/<page>/
  index.tsx
  <page>.module.scss
```

Rules:

1. Use lowercase or kebab-case page folder names.
2. Each page must have its own SCSS Module file.
3. Pages should not hold repeated UI blocks, config, or mock data.

### Components

Every component should follow these conventions:

```text
src/components/<scope>/
  <ComponentName>.tsx
  <component-name>.module.scss
  index.ts
```

Rules:

1. Use PascalCase for component files and component names.
2. Use kebab-case for component stylesheet names.
3. Colocate page-specific components under a page-oriented folder when they are not shared.

### Data Separation

When a component renders repeated options, cards, or CTA definitions:

1. Move static config to `src/resources/config`
2. Move sample or mock data to `src/resources/mock-data`
3. Keep the component focused on rendering and interaction

## Preferred Workflow

1. Scaffold route page folders first.
2. Add placeholder pages when routes are newly introduced.
3. Write or update the relevant test before implementation when tests are available for the area.
4. Confirm the test fails before implementing the feature.
5. Extract page UI into dedicated components under `src/components/`.
6. Decide whether the page is content-first or interaction-first before choosing UI primitives.
7. Use Ant Design where it reduces logic, validation work, accessibility effort, or CRUD complexity.
8. Split large components by responsibility.
9. Keep styling in SCSS Modules only.
10. Run progressive verification after meaningful changes when possible.

## UI Library Guidance

1. Always use Ant Design for forms, validation, tables, pagination, overlays, notifications, and admin layouts.
2. Prefer semantic HTML and SCSS Modules for home pages, about sections, testimonials, static content, and branded layouts.
3. Do not default to Ant Design `Card` for every section.
4. Do not use Ant Design for purely static content unless a specific primitive clearly adds value.
5. Mix Ant Design and custom markup intentionally when that produces the cleanest implementation.
6. Prefer thin shared wrappers in `src/components/ui/` when the same Ant Design patterns repeat across the app.

## State and Data Guidance

1. Keep async logic out of page files when possible.
2. Keep mock data separate from UI configuration.
3. Prefer small, typed helpers and hooks over large mixed-responsibility files.

## TDD and Verification Guidance

1. Use Test-Driven Development whenever tests exist or are being introduced.
2. Write the test first and make sure it fails before implementing the behavior.
3. Implement the minimum code required to make the test pass.
4. Refactor after the test is green.
5. After each feature increment, run the available verification steps.
6. Prefer this feature-level verification sequence when scripts exist:

```bash
npm run test && npm run build
```

7. At the end of a development cycle, run the repository verification command when available:

```bash
npm run verify
```

8. If the repository does not yet provide `test`, `lint`, or `verify` scripts, state that clearly and run the available checks instead.

## Validation Checklist

Before considering a feature done, verify:

1. Page names and folders follow repo convention
2. No inline CSS was added unnecessarily
3. No oversized component responsibilities remain
4. Repeated data is extracted into config or mock-data files
5. Component and stylesheet names follow the required conventions
6. Ant Design was used only where it adds structural or behavioral value
7. Marketing or content sections were not overbuilt with Ant Design
8. Relevant tests were written first when the area supports tests
9. Available verification commands were run before considering the work complete
