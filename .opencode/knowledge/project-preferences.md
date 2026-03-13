# Project Preferences

This file captures the preferred project structure and naming conventions.

## Naming

1. Route pages live under `src/pages/<page>/index.tsx`.
2. Page folder names should be lowercase or kebab-case.
3. Components use PascalCase file names and PascalCase component names.
4. Component folder names use kebab-case when a component has its own folder.
5. Utilities, hooks, config, mock data, and non-component support files use kebab-case.
6. Stylesheet files use kebab-case, including CSS Module files.

## Styling

1. Use SCSS Modules with `.module.scss` for page and component styles.
2. Keep styles colocated with the page or component that owns them.
3. Keep global styles in `src/styles`.
4. Do not use inline CSS for standard styling.

## Component Design

1. Keep components small and focused.
2. Split components when they start handling multiple concerns.
3. Separate static config and mock data from presentation code.
4. Use barrel exports when a folder contains multiple related files.

## Directory Preferences

1. `src/pages` is for route-level composition only.
2. `src/features` is for domain-owned UI, API logic, state, tests, and types.
3. `src/components` is for shared cross-feature UI and layout building blocks.
4. `src/resources/config` is for static configuration and constants.
5. `src/resources/mock-data` is for sample data and development fixtures.
6. `src/hooks` is for reusable cross-feature React hooks.
7. `src/utils` is for reusable helpers.
8. Feature-owned interfaces and type aliases should live in `src/features/<feature>/types/index.ts` when they are consumed beyond a tiny local-only scope.

## Routing Workflow

1. Create the page folder first.
2. Use `index.tsx` as the page entry point.
3. Add a colocated `<page>.module.scss` file for page styling.
4. Compose feature entry components from the page whenever the route belongs to a domain.
5. Move shared cross-feature UI into `src/components/`.

## Imports

1. Prefer absolute imports where supported.
2. Keep imports grouped by external first, internal second.
3. Prefer clean barrel imports when they improve readability.

## UI Library Preference

1. Follow the existing UI library patterns already used in the repository.
2. Avoid deprecated APIs.
3. Keep markup semantic and maintainable.
