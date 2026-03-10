# Routing and Pages

## Goal

Create route pages that are easy to scale and consistent with the repository structure.

## Page Template

```text
src/pages/<Name>/
  <Name>.tsx
  <Name>.module.scss
  index.ts
```

Example:

```text
src/pages/AdminDashboard/
  AdminDashboard.tsx
  AdminDashboard.module.scss
  index.ts
```

## Rules

1. Do not use `Page` in the component or folder name.
2. Each page must own its SCSS module.
3. Pages should compose feature components and shared layout pieces.
4. Pages should not contain large repeated UI structures.

## Routing Workflow

1. Create the page folder and placeholder component first.
2. Export the page through `index.ts`.
3. Register the route in the router.
4. Move feature-specific UI into `src/features` as soon as the page grows.

## Placeholder Guidance

When a route is not built yet:

1. Still create the real page folder structure.
2. Add minimal module styles instead of inline styles.
3. Include a clear placeholder heading and a safe way back home if needed.
