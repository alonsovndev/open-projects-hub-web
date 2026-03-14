# Frontend Architecture

## Folder Structure

The project should follow this structure:

```text
/src
  /app
    /layouts
    /providers
    /router
    /store
  /features
    /<feature>
      /api
      /components
      /hooks
      /model
      /tests
      /types
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

1. `src/app` contains app bootstrap, providers, router, layouts, and store wiring.
2. `src/pages` contains route-level pages only.
3. `src/features` contains domain-owned UI, API logic, state, tests, and feature types.
4. `src/components` contains shared cross-feature UI and layout primitives.
5. `src/resources/config` contains static configuration and constants.
6. `src/resources/mock-data` contains development mock data.
7. `src/styles` contains global styles.
8. `src/hooks` contains truly cross-feature custom React hooks.
9. `src/utils` contains generic utilities.

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

Use `src/components` for shared cross-feature UI. Use `src/features/<feature>/components` for feature-owned UI.

Examples:

```text
/src/features/users/components/UserTable
  UserTable.tsx
  user-table.module.scss
  index.ts

/src/components/ui
  /app-button
    AppButton.tsx
    app-button.module.scss
    index.ts

/src/components/layout
  /app-header
    AppHeader.tsx
    app-header.module.scss
    index.ts
```

Rules:

1. Use PascalCase for component file names and component names.
2. Use kebab-case for component folder names when a component has its own folder.
3. Use kebab-case for component stylesheet files.
4. Use `index.ts` barrel exports when a folder contains multiple related files.
5. Keep shared UI in `src/components`.
6. Keep domain-owned UI in the owning feature folder.

## Feature Structure

Use this structure for feature-owned code:

```text
/src/features/<feature>
  /api
  /components
  /hooks
  /model
  /tests
  /types
```

Rules:

1. Keep API integration close to the owning feature.
2. Keep feature state in `model` when needed.
3. Keep feature tests near the feature.
4. Keep feature-owned interfaces and type aliases in the feature `types/` folder instead of inside components whenever they are reusable or support feature logic.
5. Import feature types from the feature `types/index.ts` barrel when available.
6. Promote code out of a feature only when it becomes genuinely shared.

## Feature Logic and UI Separation

When a feature component starts mixing rendering with validation, navigation, derived state, orchestration, or data lookup, split the responsibilities into descriptive feature files.

Recommended shape:

```text
/src/features/<feature>
  /components
  /hooks
    use-<feature>-flow.ts
  /model
  /api
  /types
```

Rules:

1. Keep presentational components focused on JSX, class names, and simple display mapping.
2. Put feature orchestration in a descriptive hook under `hooks/`.
3. Put pure business rules, normalizers, selectors, and calculators in `model/`.
4. Put API access, mock-backed queries, and data retrieval helpers in `api/`.
5. Hooks should expose the minimum UI-ready contract needed by the component, such as state, derived state, handlers, field rules, and loading or error flags.
6. Prefer descriptive hook names based on the feature purpose instead of pattern-heavy naming.
7. Do not create extra orchestration hooks for tiny presentational-only components.

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
4. Feature-specific backend-like data should stay near the feature unless it is truly global mock data.

## Styling Rules

1. Use SCSS Modules with `.module.scss` for page and component styles.
2. Use kebab-case for stylesheet names.
3. Keep global styles in `src/styles`.
4. Avoid inline styles except for truly dynamic values.
5. Prefer semantic HTML structure in JSX.

## UI Library Usage

Use Ant Design for behavior-heavy, validated, or data-driven UI.
Use semantic HTML and SCSS Modules for marketing, content, and branded layout sections.

Use Ant Design by default for:

1. Forms and validation
2. Data tables and CRUD screens
3. Modals, drawers, confirmations, and notifications
4. Admin shells, menus, tabs, breadcrumbs, and internal layouts

Prefer semantic HTML and SCSS Modules for:

1. Home page sections and hero blocks
2. About, testimonials, and branded informational sections
3. Privacy policy, terms, and similar static content
4. Highly custom visual compositions where Ant Design would require brittle overrides

Mixed usage is encouraged when intentional.

1. Use semantic sections for layout and storytelling.
2. Use Ant Design controls where they provide accessibility, validation, or interaction value.
3. Avoid using Ant Design just to make static content feel uniform.

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
2. Pages should usually compose feature entry components.
3. Keep routing concerns separate from feature and shared presentation components.
4. Use clean page folder structure from the start.

## Forbidden Patterns

1. Large page files with embedded feature markup
2. Inline CSS for standard styling
3. Untyped config or mock-data objects when typing is practical
4. Putting mock data inside components
5. Flat route screen files directly under `src/pages`
