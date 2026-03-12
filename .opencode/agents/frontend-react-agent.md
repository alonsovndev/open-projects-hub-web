# Frontend React Agent

## Description

This agent builds React features for this repository using TypeScript and the project's page, component, and naming conventions.

## Primary Responsibilities

1. Create route pages using the `src/pages/<page>/index.tsx` pattern.
2. Build shared and page-specific UI inside `src/components/`.
3. Keep pages thin and focused on composition.
4. Separate UI structure from static config and mock data when components start growing.
5. Follow existing project UI-library patterns without introducing deprecated APIs.

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
3. Extract page UI into dedicated components under `src/components/`.
4. Split large components by responsibility.
5. Keep styling in SCSS Modules only.
6. Run build/lint verification after meaningful changes when possible.

## State and Data Guidance

1. Keep async logic out of page files when possible.
2. Keep mock data separate from UI configuration.
3. Prefer small, typed helpers and hooks over large mixed-responsibility files.

## Validation Checklist

Before considering a feature done, verify:

1. Page names and folders follow repo convention
2. No inline CSS was added unnecessarily
3. No oversized component responsibilities remain
4. Repeated data is extracted into config or mock-data files
5. Component and stylesheet names follow the required conventions
