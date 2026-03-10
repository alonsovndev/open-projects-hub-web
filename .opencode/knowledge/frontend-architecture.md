# Frontend Architecture

## Folder Structure

The project follows a feature-driven structure designed for long-term maintainability.

```text
/src
  /app         # App root setup, providers, and router shell
  /features    # Feature-specific UI, types, APIs, and hooks
  /pages       # Route-level layout containers only
  /routes      # Application route definitions
  /shared      # Shared components and cross-feature utilities
  /store       # Redux store setup when needed
```

## Page Structure

Each route page lives in its own folder.

```text
/src/pages/<PageName>
  <PageName>.tsx
  <PageName>.module.scss
  index.ts
```

Rules:

1. Do not use the `Page` suffix in names.
2. Pages are layout and composition layers only.
3. Pages should not contain business logic, repeated card markup, or feature-specific data.
4. If a page grows, split UI into `src/features/<feature>/components/`.

Example:

```text
/src/pages/Home
  Home.tsx
  Home.module.scss
  index.ts
```

## Feature Module Pattern

Each feature is self-contained.

```text
/features/<featureName>
  /api
    <featureName>Api.ts
    mockData.ts
  /components
    /<ComponentName>
      ComponentName.tsx
      ComponentName.module.scss
      index.ts
  /hooks
  /types
    index.ts
```

## Component Boundaries

Keep components small and focused.

1. One component should solve one UI responsibility.
2. Repeated UI patterns should become dedicated components.
3. Static configuration or option arrays should be extracted from JSX.
4. Data definitions should be typed in `src/features/<feature>/types`.

Example split:

- `HeroSection` for header content
- `RoleSelection` for mapping role options
- `RoleCard` for card presentation

## Data and UI Separation

Prefer this structure when rendering repeatable options or cards:

```text
/features/home/components/RoleSelection
  RoleSelection.tsx
  RoleSelection.module.scss
  rolesConfig.tsx
  index.ts

/features/home/types
  index.ts
```

Guidelines:

1. Put interfaces and shared feature types in `types/index.ts`.
2. Keep UI configuration out of the render component when possible.
3. Use `mockData.ts` only for backend-like data simulation, not for React nodes or UI handlers.

## Routing

The project currently uses a centralized router entry:

```text
/src/routes/AppRouter.tsx
```

Use `src/pages` for route elements and `src/features` for route content.

As the app grows, route groups can later be split into dedicated public/admin route modules.

## Styling Rules

1. Use SCSS Modules only.
2. Do not use inline styles except for truly dynamic values that cannot live in SCSS.
3. Keep page styles in the page folder and component styles in the component folder.
4. Prefer semantic HTML structure in JSX.

## State and Async Data

1. Prefer RTK Query for async server state.
2. Use feature `mockData.ts` plus `fakeBaseQuery()` before the backend exists.
3. Keep loading and error handling close to the consuming component.
4. Avoid pushing fetched data from pages into deep children.

## Forbidden Patterns

1. Large page components with embedded feature markup
2. Inline CSS for standard styling
3. Deprecated Ant Design props or APIs when modern alternatives exist
4. Untyped configuration arrays
5. Flat page files directly under `src/pages` for route screens
