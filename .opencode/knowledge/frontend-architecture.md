# Frontend Architecture

## Folder Structure

The project should follow this structure:

```text
/src
  /components
  /pages
  /resources
    /config
    /mock-data
  /styles
  /hooks
  /utils
```

### Responsibilities

1. `src/pages` contains route-level pages only.
2. `src/components` contains shared and page-specific UI.
3. `src/resources/config` contains static configuration and constants.
4. `src/resources/mock-data` contains development mock data.
5. `src/styles` contains global styles.
6. `src/hooks` contains custom React hooks.
7. `src/utils` contains generic utilities.

## Page Structure

Each route page lives in its own lowercase folder.

```text
/src/pages/<page>
  index.tsx
  <page>.module.scss
```

Rules:

1. Use lowercase or kebab-case page folder names.
2. Use `index.tsx` as the page entry.
3. Pages are route composition layers only.
4. Pages should not contain repeated card markup, mock data, or heavy business logic.

Example:

```text
/src/pages/home
  index.tsx
  home.module.scss
```

## Component Structure

Place UI in `src/components`.

Examples:

```text
/src/components/home
  HomePageCarousel.tsx
  home-page-carousel.module.scss
  index.ts

/src/components/common
  AppHeader.tsx
  app-header.module.scss
  index.ts
```

Rules:

1. Use PascalCase for component file names and component names.
2. Use kebab-case for component stylesheet files.
3. Use `index.ts` barrel exports when a folder contains multiple related files.
4. Colocate page-specific components under a page-oriented folder when they are not reused.

## Data and Configuration Separation

Keep non-UI data out of components.

Preferred locations:

```text
/src/resources/config/clinic-information.ts
/src/resources/mock-data/all-clinic-services.ts
```

Rules:

1. Static config belongs in `src/resources/config`.
2. Mock or sample data belongs in `src/resources/mock-data`.
3. Components should consume data, not define large config blobs inline.

## Styling Rules

1. Use SCSS Modules with `.module.scss` for page and component styles.
2. Use kebab-case for stylesheet names.
3. Keep global styles in `src/styles`.
4. Avoid inline styles except for truly dynamic values.
5. Prefer semantic HTML structure in JSX.

## Hooks and Utilities

Use these locations consistently:

```text
/src/hooks/use-fetch.ts
/src/utils/format-date.ts
```

Rules:

1. Custom hooks belong in `src/hooks` and should be named with the `use-` prefix in kebab-case filenames.
2. General-purpose helpers belong in `src/utils`.
3. Keep hooks and utilities framework-appropriate and focused.

## Routing

Pages in `src/pages` should be the route targets.

Rules:

1. Route pages should import components rather than embed complex UI directly.
2. Keep routing concerns separate from reusable presentation components.
3. Use clean page folder structure from the start.

## Forbidden Patterns

1. Large page files with embedded feature markup
2. Inline CSS for standard styling
3. Untyped config or mock-data objects when typing is practical
4. Putting mock data inside components
5. Flat route screen files directly under `src/pages`
