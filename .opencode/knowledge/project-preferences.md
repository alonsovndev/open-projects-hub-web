# Project Preferences

This file captures repository-specific working preferences inferred from current implementation decisions.

## Naming

1. Route pages live in their own folder under `src/pages`.
2. Page components do not use the `Page` suffix.
3. Feature components use PascalCase names and dedicated folders.

## Styling

1. Do not use inline CSS for regular styling.
2. Use SCSS Modules for pages and components.
3. Keep styles colocated with the page or component that owns them.

## Component Design

1. Split components when they start handling multiple concerns.
2. Separate data/config from presentation when rendering repeated options.
3. Create focused components rather than one large section component.

## Pages vs Features

1. `src/pages` is for route-level composition only.
2. `src/features` is for actual feature UI and logic.
3. Shared layout elements move to `src/shared` only after reuse is clear.

## Routing Workflow

1. Add placeholder pages early when new routes are introduced.
2. Keep the final folder structure from the beginning.
3. Route buttons should navigate via router paths, not hardcoded UI handlers embedded in config unless intentional.

## Ant Design Preferences

1. Use current APIs only.
2. Avoid deprecated props and replace them with modern equivalents.
3. Prefer simple, maintainable Ant Design composition over over-customized markup.
