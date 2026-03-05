# AGENTS.md

This document provides essential guidelines for agents working on this repository, including build commands, test commands, code style guidelines, and error-handling practices.

## Build, Lint, and Test Commands

### Development Server

- **Command:**

  ```bash
  npm run dev
  ```

  - Starts the Vite development server on a local port.

### Build Application

- **Command:**

  ```bash
  npm run build
  ```

  - Executes TypeScript checks and bundles the application for production.

### Lint Code

- **Command:**

  ```bash
  npm run lint
  ```

  - Runs ESLint against all files in the project.

### Run Tests

> **Note:** Testing scripts are currently unavailable. Add tests to the repository to enable testing automation.

## Code Style Guidelines

### Component Architecture (Feature-Driven)
- **Folder Structure**: Always use Feature-Driven Development. Components belong in `src/features/<featureName>/components/`.
- **Component Isolation**: Every component must have its own dedicated directory containing:
  - `ComponentName.tsx`: The actual React component (using named exports, e.g., `export const ComponentName`).
  - `ComponentName.module.scss`: Isolated SCSS modules for styling (NEVER use standard `.css` or global class names).
  - `index.ts`: A clean barrel export (e.g., `export { ComponentName } from "./ComponentName";`).
- **Pages**: `src/pages` should only contain high-level layout containers that import feature components. They should NOT contain complex logic or hardcoded content.

### Styling (Ant Design + SCSS Modules)
- **Ant Design First**: Rely on Ant Design components (`Typography`, `Layout`, `Row`, `Col`, `Button`, `Skeleton`, etc.) for UI elements.
- **SCSS Modules**: Use `.module.scss` for custom styling. Apply classes using `className={styles["class-name"]}`.
- **Responsive Design**: Ensure responsive designs using Ant Design's grid system (`xs`, `sm`, `md`, `lg`) combined with media queries inside the SCSS modules.

### State Management & Data Fetching (RTK Query)
- **Mock APIs First**: When building new features, simulate backend data using a Mock API pattern inside `src/features/<featureName>/api/mockData.ts` with a `simulateNetworkDelay` wrapper.
- **RTK Query Slices**: Define endpoints using `createApi` and `fakeBaseQuery()` inside `src/features/<featureName>/api/<featureName>Api.ts`.
- **Component-Level Fetching**: Favor granular component-level data fetching. Each component should call its own RTK Query hook (e.g., `useGetWhatWeDoQuery()`).
- **Loading & Error States**: Always handle `isLoading` (using Ant Design `<Skeleton>` or `<Spin>`) and `isError` (using Ant Design `<Alert>`) gracefully.

### Imports
- Use **absolute imports** where applicable, and **relative imports** for files within the same module or subdirectory.
- Group external library imports at the top, followed by internal modules.
- Order imports alphabetically where possible for consistency.

### Formatting

- Maintain consistent spacing and indentation:
  - Use **2 spaces** for indentation.
  - Limit line length to **100 characters**.
  - No trailing spaces at the end of lines.
- Use Prettier (if integrated) for automatic formatting.

### TypeScript Rules

- All files must use the `.tsx` or `.ts` extensions.
- Always prefer **strict types** over `any`.
- Use TypeScript's utility types like `Partial<T>`, `Readonly<T>`, or `Pick<T>` where relevant.
- Define props and state as interfaces when working with React components.

### Naming Conventions

- File and directory names:
  - Use **PascalCase** for React components.
  - Use **camelCase** for utility functions, variables, and constants.
  - Use **SCREAMING_SNAKE_CASE** for environment variables and constants.
- React components:
  - Function components should be named as `ComponentName: React.FC<Props> = () => {}`

### Error Handling

- Wrap asynchronous logic in `try-catch` blocks to handle runtime errors.
- For frontend UI, handle errors gracefully by showing user-friendly messages.
- Always use `console.error` for logging errors in development, but ensure logs do not expose sensitive data.

## General Agent Guidelines

1. Review and understand the current project structure before making changes.
2. Test changes locally using `npm run dev` and ensure there are no build errors before committing.
3. Follow provided naming conventions and formatting guidelines strictly to maintain consistency in the codebase.
4. If any dependencies are added, ensure they are relevant and do not bloat the project unnecessarily.
5. In case of ambiguity or conflicts in code style, prioritize consistency with the existing codebase.

## Suggestions for Agents

Agents are encouraged to:

- Add test cases to improve test coverage whenever functionality is updated.
- Automate repetitive tasks with scripts when feasible to enhance project maintainability.

**End of Guidelines**
