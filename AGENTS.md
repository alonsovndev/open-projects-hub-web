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

## Project Structure

Use this structure by default:

```text
src/
  components/
    home/
      HomePageCarousel.tsx
      home-page-carousel.module.scss
      index.ts
  pages/
    home/
      index.tsx
      home.module.scss
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

- `src/pages/`: Route-level page entry points only.
- `src/components/`: Shared and page-specific UI components.
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
4. Do not place repeated UI blocks, static config, or heavy logic in page files.

## Components

Place components in `src/components/`.

Rules:

1. Use PascalCase for component file names and component names.
2. Page-specific components should live in `src/components/<page>/`.
3. Shared components should live in a clearly named shared location under `src/components/`.
4. Use `index.ts` barrel exports when a folder contains multiple related files.

Example:

```text
src/components/home/
  HomePageCarousel.tsx
  home-page-carousel.module.scss
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

## Naming Conventions

| File Type | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `HomePageCarousel.tsx` |
| Pages | `index.tsx` in lowercase folder | `src/pages/home/index.tsx` |
| Utilities | kebab-case | `format-date.ts` |
| Config | kebab-case | `clinic-information.ts` |
| Mock data | kebab-case | `all-clinic-services.ts` |
| Stylesheets | kebab-case | `home-page-carousel.module.scss` |

## Code Organization Best Practices

1. Colocate files with the page or component they belong to when they are not shared.
2. Keep mock data and static config out of components.
3. Keep components focused and easy to understand.
4. Prefer clean imports through `index.ts` barrels when helpful.
5. Use absolute imports where supported by the project setup.

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
