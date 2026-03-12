# React UI Development

## Description

This skill focuses on building reusable, typed, and maintainable React UI using the project's page, component, and naming conventions.

## Core Rules

1. Build route pages in `src/pages/<page>/`.
2. Build shared and page-specific UI in `src/components/`.
3. Use `index.tsx` as the page entry file.
4. Use SCSS Modules with `.module.scss` for page and component styles.
5. Do not use inline CSS for standard styling.
6. Use semantic HTML where appropriate.
7. Use Ant Design primarily for interactive, data-heavy, validated, or admin-oriented UI.
8. Prefer semantic HTML and SCSS for marketing, storytelling, and static content sections.

## Component Design

1. Split oversized components early.
2. Extract repeated UI into dedicated components.
3. Keep render functions small and readable.
4. Move static option arrays and content definitions outside the rendering component.
5. Keep config in `src/resources/config` and mock data in `src/resources/mock-data`.
6. Do not introduce Ant Design abstractions where semantic markup and SCSS are simpler and clearer.

## Styling

1. Use SCSS Modules only for local styles.
2. Use kebab-case file names for stylesheets.
3. Apply classes through the imported module object.
4. Prefer module classes over inline overrides.
5. Keep global styles in `src/styles`.

## Ant Design Usage

1. Use Ant Design for forms, validation, tables, pagination, tags, badges, overlays, and admin layouts.
2. Prefer semantic HTML and SCSS Modules for hero sections, testimonials, informational sections, and policy pages.
3. Mix Ant Design and custom markup intentionally when it improves both UX consistency and design flexibility.
4. Avoid using Ant Design just to wrap static content.
5. Prefer thin wrapper components under `src/components/ui/` when the same Ant Design patterns repeat.

## Accessibility

1. Use semantic tags like `main`, `section`, `header`, and `footer`.
2. Keep headings properly ordered.
3. Ensure buttons and navigation affordances are explicit.

## Async UI

1. Keep async state concerns out of route pages when possible.
2. Show clear loading and error states in the consuming UI.
3. Keep mock data and API simulation separate from presentation code.

## Preferred Workflow

1. Create the page folder if a route is needed.
2. Add `index.tsx` and the page SCSS Module first.
3. Create the components required by that page inside `src/components/<page>/` or a shared component folder.
4. Decide early whether the UI is marketing/content-driven or interaction/data-driven.
5. Use semantic HTML for content-first sections and Ant Design for behavior-heavy sections.
6. Extract repeated UI into focused subcomponents.
7. Extract config and mock data into `src/resources` when arrays or content become non-trivial.
8. Verify imports, styling, and route composition stay clean.
