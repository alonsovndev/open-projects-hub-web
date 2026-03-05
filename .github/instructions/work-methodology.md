---
applyTo: "**"
---

# Work Methodology

## 1. Test-Driven Development (TDD)

Adopt the principles of Test-Driven Development to ensure robust and maintainable code:

- **Write the Test FIRST**: Never begin writing the implementation without a corresponding test prepared first.
- **Verify It FAILS (Red)**: Ensure the test initially fails to confirm it's identifying the absence of functionality.
- **Implement the MINIMUM Code to Pass (Green)**: Write only the code needed to make the test pass, with no extras.
- **Refactor If Necessary**: Optimize the code for readability, maintainability, or performance after passing the test.

---

## 2. Scope Rules for Folder Organization

Maintain a clean codebase with strict separation of concerns using Feature-Driven Development:

### Folder Structure:

1. **Global Scope** (`src/shared/`):
   - Contains code shared universally across multiple features.
   - Includes:
     - `types/`
     - `utils/`
     - `components/`
     - `hooks/`

2. **Local Feature Scope** (`src/features/X/`):
   - Contains code specific to an individual feature.
   - Every component within a feature MUST be isolated inside `src/features/X/components/<ComponentName>/` with its `.tsx`, `.module.scss`, and `index.ts`.
   - Data fetching is handled internally by RTK Query inside `src/features/X/api/`.
   - Examples:
     - `home/`
     - `auth/`

3. **Infrastructure / Global State**:
   - `src/store/`: The global Redux configuration.
   - `src/app/`: The root React bindings and context providers.
   - `src/pages/`: High-level layout orchestrators and route definitions.

---

## 3. Continuous Verification

Ensure high code quality and consistency through progressive verification steps:

1. **After Each Feature**:
   - Run the following commands to test and build:
     ```bash
     npm run test && npm run build
     ```

2. **At the End of Development Cycle**:
   - Perform a comprehensive verification using:
     ```bash
     npm run verify
     ```
   - This command executes:
     - Linting
     - Type-checking
     - Unit tests
     - E2E tests
     - Build

By following this work methodology, the repository will stay organized, tests will lead the implementation process, and code quality will consistently meet high standards.
