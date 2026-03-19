# Boilerplate Guide for New Projects

## High-level View

This repository can be used as a reference for starting a new SPA that needs:

- public and protected routes
- a feature-based folder structure
- Redux Toolkit + RTK Query
- Ant Design for structured UI
- SCSS Modules for local styling

The best way to reuse this project is to copy the architectural patterns, not the placeholder product content.

## Replication Checklist

1. Create a Vite React + TypeScript app.
2. Recreate the `src/app/`, `src/features/`, `src/pages/`, `src/shared/`, and `src/resources/` split.
3. Add React Router, Redux Toolkit, React Redux, Ant Design, and Sass support.
4. Add Vitest, React Testing Library, Playwright, and coverage support before feature work grows.
5. Build a shared base API and typed store before adding feature endpoints.
6. Register routes per feature and aggregate them centrally.
7. Keep pages thin and move domain logic into features.

## Suggested Folder Blueprint

```text
src/
  app/
    api/
    layouts/
    routing/
    store/
  features/
    <feature>/
      api/
      components/
      hooks/
      model/
      state/
      types/
      routes.tsx
      index.ts
  pages/
    <page>/
      index.tsx
      <page>.module.scss
  shared/
    components/
  resources/
    config/
  styles/
```

## Step-by-Step Setup

### 1. Bootstrap the app

Use the ecosystem defaults first:

```bash
npm create vite@latest my-app -- --template react-ts
```

### 2. Install the core libraries

```bash
npm install react-router-dom @reduxjs/toolkit react-redux antd
npm install -D \
  sass-embedded \
  prettier \
  vitest \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  @playwright/test
```

### 3. Create the app shell first

Implement these pieces before building product features:

- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/store/store.ts`
- `src/app/store/hooks.ts`
- `src/app/routing/AppRouter.tsx`
- `src/app/routing/routes.tsx`
- `src/app/routing/GuardResolver.tsx`
- `src/app/api/base-api.ts`

### 4. Add the test harness before feature depth

Set up these pieces while the app is still small:

- `vitest.config.ts`
- `playwright.config.ts`
- `src/test/setup.ts`
- `src/test/utils/render-with-providers.tsx`

This keeps testing aligned with the architecture instead of bolting it on later.

### 5. Add one real feature end to end

Start with a feature like auth because it exercises:

- UI composition
- form validation
- API calls
- store updates
- route guards

Once that path works, use it as the template for later features.

## Boilerplate Rules to Preserve

### Keep

- feature-owned `routes.tsx`
- thin pages
- shared layouts
- typed Redux hooks
- RTK Query endpoint injection
- colocated SCSS Modules
- shared provider-aware test utilities
- pure model files for reusable validation logic

### Avoid

- putting API calls directly in page components
- creating one giant `components/` folder for all domains
- mixing shared UI with feature-only business components
- duplicating route protection logic in many places

## Recommended Hardening Before Reuse

Before turning this reference into a reusable starter, add:

1. working tests with meaningful auth, dashboard, and viewer coverage
2. a passing build
3. green formatting or lint checks
4. coverage thresholds and report publishing in CI
5. environment validation
6. a 404 page and broader error handling

## Learning Resources

- [Create a Vite project](https://vite.dev/guide/#scaffolding-your-first-vite-project)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)
- [React Router getting started](https://reactrouter.com/start/declarative/installation)
- [Ant Design for React](https://ant.design/docs/react/getting-started)
- [Sass basics](https://sass-lang.com/guide/)
- [Vitest getting started](https://vitest.dev/guide/)
- [Playwright install and setup](https://playwright.dev/docs/intro)
