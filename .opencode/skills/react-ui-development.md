# React UI Development

## Description

This skill focuses on building reusable, typed, and maintainable React UI using Ant Design and SCSS Modules.

## Core Rules

1. Build feature UI inside `src/features/<feature>/components/<ComponentName>/`.
2. Give every component its own folder with:
   - `ComponentName.tsx`
   - `ComponentName.module.scss`
   - `index.ts`
3. Keep pages in `src/pages/<PageName>/` and use them only as route-level composition shells.
4. Do not use inline CSS for standard styling.
5. Use semantic HTML where appropriate.

## Component Design

1. Split oversized components early.
2. Extract repeated UI into dedicated components.
3. Keep render functions small and readable.
4. Move static option arrays and card definitions outside the rendering component.
5. Type configuration objects with interfaces from the feature `types` folder.

## Styling

1. Use SCSS Modules only.
2. Apply classes with `className={styles["class-name"]}` or equivalent module access.
3. Prefer module classes over inline overrides.
4. Use responsive layout rules in SCSS and Ant Design layout primitives where useful.

## Ant Design Usage

1. Use current Ant Design APIs only.
2. Avoid deprecated props such as `bordered` when a modern replacement exists.
3. Prefer Ant Design building blocks for layout and controls, but keep marketing/page composition semantic.

## Accessibility

1. Use semantic tags like `main`, `section`, `header`, and `footer`.
2. Keep headings properly ordered.
3. Ensure buttons and navigation affordances are explicit.

## Async UI

1. Use RTK Query hooks inside feature components.
2. Always handle `isLoading` and `isError` with Ant Design feedback components.
3. Keep async data concerns out of page containers.

## Preferred Workflow

1. Create the page folder if a route is needed.
2. Create the feature components required by that page.
3. Extract repeated UI into focused subcomponents.
4. Extract UI config into typed config files when arrays become non-trivial.
5. Verify imports, styling, and route composition stay clean.
