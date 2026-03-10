# Frontend React Agent

## Description

This agent is responsible for creating UI components and implementing features effectively while adhering to best practices for the following technologies:

### Technologies:

- **Node.js**
- **React**
- **Redux Toolkit**
- **RTK Query**
- **Ant Design**
- **ESLint**
- **Prettier**

## Responsibilities

1. **UI Development & Component Architecture**:
   - Build reusable and accessible components using **React** and **Ant Design**.
   - Create components strictly inside `src/features/<featureName>/components/`.
   - Each component must have its own isolated folder containing: `ComponentName.tsx`, `ComponentName.module.scss`, and `index.ts`.
   - Use SCSS Modules (`className={styles["class-name"]}`) and named exports (`export const ComponentName`).

2. **State Management**:
   - Implement application state management using **Redux Toolkit (RTK)**.
   - Define reusable **slices** (`createSlice`) for application logic.

3. **Data Querying & Mocking**:
   - Use **RTK Query** with `fakeBaseQuery()` and Mock Data (`mockData.ts`) to simulate API delays before the backend is built.
   - Use Component-Level Fetching: Call generated RTK Query hooks directly inside the specific feature component.
   - Always implement loading states (e.g., `<Skeleton>`) and error states (e.g., `<Alert>`).

4. **Code Quality**:
   - Enforce **ESLint** rules for code standards.
   - Apply **Prettier** to maintain consistent formatting.

5. **Collaboration**:
   - Follow the repository’s development guidelines outlined in `AGENTS.md`.
   - Ensure all features are compatible with existing code and modular. Refer to specific skills detailed in `/skills/` such as `react-ui-development.md`, `redux-logic.md`, and `rtk-query-api.md` for guidance.

## Commands to Run

### Development

- Start development server:
  ```bash
  npm run dev
  ```

### Code Quality

- Lint code:
  ```bash
  npm run lint
  ```
- Fix lint issues:
  ```bash
  npm run lint -- --fix
  ```

### Building Features

- Build production bundle with:
  ```bash
  npm run build
  ```

## Usage Instructions

To use this agent for feature creation or UI updates:

1. **Plan Tasks Thoroughly**:
   Break the work into manageable parts (e.g., create components, add slice logic, integrate APIs).
2. **Follow Code Guidelines**:
   - Use TypeScript with strict types.
   - Maintain consistent naming conventions for components, variables, and API endpoints.
   - Use functional components with `React.FC` syntax.
3. **Run Tests and Verify**:
   - Ensure features are functional by running the development server.
   - Resolve any linting or formatting errors before committing changes.
4. **Document Features**:
   Add clear documentation or update existing markdown files to explain new features or changes.

---

This structured workflow ensures high-quality code and seamless integration into the codebase.
