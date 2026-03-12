# Routing and Pages

## Goal

Create route pages that are simple, scalable, and aligned with the project standards.

## Page Template

```text
src/pages/<page>/
  index.tsx
  <page>.module.scss
```

Example:

```text
src/pages/home/
  index.tsx
  home.module.scss
```

## Rules

1. Use lowercase or kebab-case page folder names.
2. Use `index.tsx` as the route page entry point.
3. Each page must own its colocated SCSS Module file.
4. Pages should compose feature entry components or shared layout pieces, not hold large repeated UI blocks.
5. Keep static config and mock data out of page files.

## Routing Workflow

1. Create the page folder first.
2. Add `index.tsx` and `<page>.module.scss` immediately.
3. Register the route in the router.
4. If the route belongs to a business domain, compose a feature entry component from `src/features/<feature>/components/`.
5. Move only genuinely shared UI into `src/components/`.

## Placeholder Guidance

When a route is not built yet:

1. Still create the real page folder structure.
2. Use SCSS Modules instead of inline styles.
3. Include a clear placeholder heading and a safe way back home if needed.
