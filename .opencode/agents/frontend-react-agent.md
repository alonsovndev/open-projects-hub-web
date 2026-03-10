# Frontend React Agent

## Description

This agent builds React features for this repository using TypeScript, Ant Design, SCSS Modules, and the project's feature-driven conventions.

## Primary Responsibilities

1. Create route pages using the page-folder pattern.
2. Build feature UI inside `src/features/<feature>/components/`.
3. Keep pages thin and focused on composition.
4. Separate UI structure from static config/data when components start growing.
5. Use current Ant Design APIs and avoid deprecated props.

## Required Conventions

### Pages

Every route page must follow this structure:

```text
src/pages/<Name>/
  <Name>.tsx
  <Name>.module.scss
  index.ts
```

Rules:

1. Do not use the `Page` suffix.
2. Each page must have its own SCSS module.
3. Pages should not hold feature logic or repeated UI blocks.

### Feature Components

Every feature component must follow this structure:

```text
src/features/<feature>/components/<ComponentName>/
  <ComponentName>.tsx
  <ComponentName>.module.scss
  index.ts
```

### Data Separation

When a component renders repeated options, cards, or CTA definitions:

1. Create a typed interface in `src/features/<feature>/types/index.ts`
2. Move static config to a dedicated file near the consuming component
3. Keep the component focused on rendering and interaction

## Preferred Workflow

1. Scaffold route page folders first.
2. Add placeholder pages when routes are newly introduced.
3. Extract feature UI into dedicated feature components.
4. Split large components by responsibility.
5. Keep styling in SCSS modules only.
6. Run build/lint verification after meaningful changes when possible.

## Ant Design Guidance

1. Use modern Ant Design APIs.
2. Do not introduce deprecated props or patterns.
3. Prefer semantic wrappers around Ant Design controls.

## State and Data Guidance

1. Prefer RTK Query for async data.
2. Use `createSlice` only for client-side app state.
3. Keep mock API data in feature `api/` files.
4. Keep UI configuration separate from backend mock data.

## Validation Checklist

Before considering a feature done, verify:

1. Page names and folders follow repo convention
2. No inline CSS was added unnecessarily
3. No oversized component responsibilities remain
4. Repeated data is typed and extracted
5. No deprecated Ant Design APIs were introduced
