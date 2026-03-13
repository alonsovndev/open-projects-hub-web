# AGENTS.md

This document defines the working standards for agents in this repository.

## Build, Lint, and Test Commands

### Development Server

```bash
npm run dev
```

Starts the Vite development server.

### Build Application

```bash
npm run build
```

Builds the application for production.

### Lint Code

```bash
npm run lint
```

Runs ESLint when configured.

### Run Tests

Testing scripts are not currently configured.

### Repository Script Status

Current repository status:

1. `npm run build` is available.
2. `npm run test` is present but currently a placeholder that fails.
3. `npm run lint` is referenced in guidance but is not currently configured in `package.json`.
4. `npm run verify` is not currently configured.

Agents should follow the preferred verification workflow when these scripts exist, and clearly state when a requested verification step cannot run because the repository does not yet provide the script.

## Project Structure

Use this structure by default:

```text
src/
  app/
    layouts/
    providers/
    router/
    store/
  pages/
    home/
      index.tsx
      home.module.scss
  features/
    auth/
      api/
      components/
      hooks/
      model/
      tests/
      types/
    users/
      api/
      components/
      hooks/
      model/
      tests/
      types/
  components/
    ui/
      app-button/
        AppButton.tsx
        app-button.module.scss
        index.ts
    layout/
      app-header/
        AppHeader.tsx
        app-header.module.scss
        index.ts
  resources/
    mock-data/
      all-clinic-services.ts
    config/
      clinic-information.ts
  styles/
    global.scss
  hooks/
    use-fetch.ts
  utils/
    format-date.ts
```

### Folder Responsibilities

- `src/app/`: Application bootstrap, providers, router, layouts, and store setup.
- `src/pages/`: Route-level page entry points only.
- `src/features/`: Domain-owned UI, API logic, state, tests, and feature types.
- `src/components/`: Shared cross-feature UI, layout components, and UI wrappers.
- `src/styles/`: Global styles.
- `src/resources/mock-data/`: Development mock data and sample payloads.
- `src/resources/config/`: Static configuration and constants.
- `src/hooks/`: Custom React hooks.
- `src/utils/`: General utility functions.

## Pages

Each route page must follow this pattern:

```text
src/pages/<page>/
  index.tsx
  <page>.module.scss
```

Rules:

1. Use lowercase page folder names such as `home` or `admin-dashboard`.
2. Use `index.tsx` as the page entry file.
3. Keep pages thin and focused on route composition.
4. Pages should compose feature components and shared layout pieces.
5. Do not place repeated UI blocks, feature logic, static config, or heavy state logic in page files.

## Features

Use `src/features/` for business-domain-owned code.

Recommended structure:

```text
src/features/<feature>/
  api/
  components/
    <component-folder>/
      <ComponentName>.tsx
      <component-name>.module.scss
      index.ts
  hooks/
  model/
  tests/
  types/
```

Rules:

1. Put business-domain UI, async logic, and state close to the owning feature.
2. Keep feature components inside `src/features/<feature>/components/`.
3. Use kebab-case for component folder names.
4. Put feature API integration and mock-facing logic in `api/`.
5. Put feature-specific state and selectors in `model/` when needed.
6. Put feature tests inside the owning feature.
7. Promote code to `src/components`, `src/hooks`, or `src/utils` only when it is truly cross-feature.

## Components

Place components in `src/components/`.

Rules:

1. Use PascalCase for component file names and component names.
2. Use kebab-case for component folder names when a component has its own folder.
3. Reserve `src/components/` for shared cross-feature UI, layout components, and UI wrappers.
4. Prefer `src/components/ui/` for reusable wrapped primitives and `src/components/layout/` for shared shells.
5. Do not place feature-owned business components in `src/components/` when they belong inside `src/features/`.
6. Use `index.ts` barrel exports when a folder contains multiple related files.

Example:

```text
src/components/ui/
  app-button/
    AppButton.tsx
    app-button.module.scss
    index.ts
```

## Styling

Use SCSS Modules for component- and page-level styles.

Rules:

1. Use `.module.scss` for colocated styles.
2. Use kebab-case for stylesheet names.
3. Keep global styles in `src/styles/`.
4. Avoid inline styles unless the value is truly dynamic.

## UI Library Guidelines

Core principle:

- Use Ant Design for behavior and structure.
- Use semantic HTML and SCSS Modules for branding, storytelling, and custom visual identity.

### Use Ant Design For

1. Forms and validation
   - `Form`
   - `Input`, `Select`, `DatePicker`
   - `Form.Item` validation
2. Data display and CRUD flows
   - `Table`
   - `Pagination`
   - `Tag`
   - `Badge`
3. Overlays and state-driven interactions
   - `Modal`
   - `Drawer`
   - `Popconfirm`
   - `notification`, `message`
4. Admin and internal layouts
   - `Layout`
   - `Menu`
   - `Breadcrumb`
   - `Tabs`

### Prefer Semantic HTML and SCSS For

1. Marketing and content sections
2. Static informational pages
3. Highly custom branded layouts or UI elements

### Mixed Approach

Mixing Ant Design with semantic HTML is encouraged.

Recommended default:

1. Use semantic sectioning and custom layout for page composition.
2. Use Ant Design where it reduces interaction, validation, accessibility, or CRUD complexity.
3. Use SCSS Modules for spacing, branding, and custom visual styling.

### Anti-Patterns

1. Do not use Ant Design for purely static content by default.
2. Do not wrap every section in `Card` automatically.
3. Do not recreate Ant Design form validation manually for standard forms.
4. Do not deeply override Ant Design internal CSS classes unless absolutely necessary.
5. Do not use Ant Design only to make marketing pages feel superficially consistent.

### Decision Checklist

Before choosing Ant Design, ask:

1. Is this data-driven or CRUD-related?
2. Does it need validation, state handling, or accessibility behavior?
3. Would Ant Design reduce custom logic or styling effort?

If two or more answers are yes, prefer Ant Design.
Otherwise, prefer semantic HTML and SCSS Modules.

### Wrapper Components Strategy

When the same Ant Design patterns repeat, prefer thin shared wrappers such as:

```text
src/components/ui/
  AppButton.tsx
  AppForm.tsx
  AppModal.tsx
  AppTable.tsx
```

Rules:

1. Wrap Ant Design, do not reimplement it.
2. Centralize shared props and styling in the wrapper.
3. Reuse wrappers across admin and internal tools when it improves consistency.

## Work Methodology

### Test-Driven Development (TDD)

Use TDD whenever tests exist or are being added for the area under change.

Rules:

1. Write the test first.
2. Confirm the test fails before implementing the behavior.
3. Implement only the minimum code required to make the test pass.
4. Refactor after the test is green.
5. Keep code structured so it remains easy to test.

### Continuous Verification

Use progressive verification during development instead of waiting until the very end.

After each feature increment, prefer:

```bash
npm run test && npm run build
```

At the end of a development cycle, prefer:

```bash
npm run verify
```

If `test`, `lint`, or `verify` are not configured in the repository, explicitly say so and run the checks that are available instead.

## Naming Conventions

| File Type | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `HomePageCarousel.tsx` |
| Component folders | kebab-case | `requirements-viewer/` |
| Pages | `index.tsx` in lowercase folder | `src/pages/home/index.tsx` |
| Utilities | kebab-case | `format-date.ts` |
| Config | kebab-case | `clinic-information.ts` |
| Mock data | kebab-case | `all-clinic-services.ts` |
| Stylesheets | kebab-case | `home-page-carousel.module.scss` |

## Code Organization Best Practices

1. Colocate files with the page or component they belong to when they are not shared.
2. Keep mock data and static config out of components.
3. Keep pages thin, features cohesive, and shared UI generic.
4. Keep components focused and easy to understand.
5. Prefer clean imports through `index.ts` barrels when helpful.
6. Use absolute imports where supported by the project setup.

## TypeScript Rules

1. Use `.ts` and `.tsx` only.
2. Prefer strict types over `any`.
3. Define props with interfaces.
4. Keep utility and config files typed.

## Error Handling

1. Wrap asynchronous logic in `try-catch` blocks when needed.
2. Show user-friendly UI feedback for loading and error states.
3. Use `console.error` only for safe development diagnostics.

## General Agent Guidelines

1. Review the existing structure before making changes.
2. Follow these conventions consistently.
3. Avoid adding unnecessary dependencies.
4. Validate changes with build, lint, or type-check commands when possible.
5. If guidance conflicts, prefer this file and the `.opencode` setup.

## Non-Negotiable Rules

1. Do not commit changes unless the user explicitly asks for a commit.
2. Do not commit directly to `main` or `master`.
3. Do not push or force-push unless the user explicitly asks.
4. Never force-push to protected branches such as `main` or `master`.
5. Do not remove, weaken, skip, or rewrite tests just to make builds or checks pass.
6. Do not disable linting, type-checking, verification steps, CI checks, or git hooks just to get a green result.
7. Do not change scripts, CI configuration, or test configuration merely to hide failures.
8. Do not use bypass flags such as `--no-verify` unless the user explicitly requests it.
9. Do not use destructive git or filesystem commands unless the user explicitly requests them.
10. Do not overwrite, discard, or revert user changes you did not make unless the user explicitly requests it.
11. Do not commit secrets, credentials, `.env` files, or sensitive configuration.
12. Do not claim a test, build, or verification step passed unless it was actually run.
13. Do not present mock, stub, or placeholder behavior as production-complete without clearly saying so.
14. If a non-negotiable rule conflicts with task completion, stop and report the constraint instead of silently working around it.
