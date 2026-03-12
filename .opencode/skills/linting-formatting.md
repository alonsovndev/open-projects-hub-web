# Linting and Formatting

## Description

This skill enforces code quality and readability through linting, formatting, and verification workflows when the repository provides those tools.

## Verification Workflow

Use progressive verification rather than waiting until the end of the task.

1. After each feature increment, run the available repository checks.
2. Prefer this sequence when scripts exist:

```bash
npm run test && npm run build
```

3. At the end of a development cycle, run the repository verification command when available:

```bash
npm run verify
```

4. If some scripts are not configured yet, say so explicitly and run the checks that do exist.

### Capabilities

1. **Linting**:
   - When a lint script is configured, fix common errors with:
     ```bash
      npm run lint -- --fix
      ```
    - Add eslint-disable for unavoidable exceptions with a clear comment.

2. **Formatting**:
   - When Prettier is part of the repository workflow, format code automatically with:
      ```bash
      npx prettier --write .
      ```

3. **Consistency**:
   - Maintain consistent code style across the project.

4. **Verification Discipline**:
   - Use available test, lint, type-check, and build commands incrementally during development.
   - Prefer repository-level verification commands when they exist.
   - If linting or formatting tools are not configured, say so explicitly and use the checks that are available.

---

This skill supports code quality initiatives defined in `AGENTS.md`.
