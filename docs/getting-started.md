# Getting Started

Quick start guide for developers and AI agents new to the Open Projects Hub Web project.

## Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Redux

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd open-projects-hub-web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Essential Commands

### Development

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run type-check   # TypeScript validation
```

### Code Quality

```bash
npm run format         # Format all files with Prettier
npm run format:check   # Check formatting without fixing
npm run lint           # Run ESLint (when configured)
```

### Testing

```bash
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:coverage  # Generate coverage report
npm run test:e2e       # Run Playwright E2E tests
npm run test:e2e:ui    # Run E2E tests in UI mode
```

### Verification

```bash
npm run verify   # Run all checks (test + type-check + build)
```

**Note**: Some commands may not be fully configured yet. See `AGENTS.md` for current script status.

## Git Workflow

This repository uses Husky git hooks:

- **pre-commit**: Automatically formats staged files
- **commit-msg**: Validates commit message format

### Commit Message Format

Use Conventional Commits format:

```
<type>: <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

**Examples**:

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update architecture guide"
```

## Project Structure Overview

```text
src/
  app/          # Core infrastructure (routing, store, layouts)
  features/     # Business features (⭐ main workspace)
  pages/        # Route entry points (thin composition)
  shared/       # Cross-feature reusable code
  resources/    # Static config and data
  styles/       # Global styles
```

**Key principle**: Features are self-contained modules with their own routes, components, state, and API logic.

See **[Folder Structure](./architecture/folder-structure.md)** for detailed breakdown.

## Your First Feature

Follow this workflow when adding a new feature:

### 1. Create Feature Structure

```bash
mkdir -p src/features/my-feature/{components,hooks,types,api,state}
touch src/features/my-feature/routes.tsx
touch src/features/my-feature/index.ts
```

### 2. Define Routes

```typescript
// src/features/my-feature/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { MyFeaturePage } from "@/pages/my-feature";

export const myFeatureRoutes: AppRoute[] = [
  {
    path: "/my-feature",
    element: <PrivateLayout><MyFeaturePage /></PrivateLayout>,
    guards: ["auth"],
  },
];
```

### 3. Create Public API

```typescript
// src/features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
export { MyFeatureComponent } from "./components/MyFeatureComponent";
```

### 4. Register Routes

```typescript
// src/app/routing/routes.tsx
import { myFeatureRoutes } from "@/features/my-feature";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...myFeatureRoutes, // Add here
];
```

### 5. Create Page

```typescript
// src/pages/my-feature/index.tsx
import type { FC } from "react";
import { MyFeatureComponent } from "@/features/my-feature";

export const MyFeaturePage: FC = () => {
  return <MyFeatureComponent />;
};
```

See **[Adding Features](./guides/adding-features.md)** for complete workflow.

## Common Patterns Quick Reference

### Route Guards

```typescript
guards: ["public"]; // Anyone
guards: ["guest"]; // Unauthenticated only
guards: ["auth"]; // Authenticated required
guards: ["auth", { role: "admin" }]; // Admin-only
```

### Layouts

```typescript
// Public pages
<PublicLayout><HomePage /></PublicLayout>

// Authenticated pages
<PrivateLayout><DashboardPage /></PrivateLayout>
```

### Imports (Use Feature Public APIs)

```typescript
// ✅ Correct - public API
import { LoginForm } from "@/features/auth";

// ❌ Wrong - deep import
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";
```

### Component Naming

| Type             | Convention | Example                  |
| ---------------- | ---------- | ------------------------ |
| Component file   | PascalCase | `LoginForm.tsx`          |
| Component folder | kebab-case | `login-form/`            |
| Hook file        | kebab-case | `use-login-form.ts`      |
| Stylesheet       | kebab-case | `login-form.module.scss` |
| Feature folder   | kebab-case | `auth/`, `dashboard/`    |

## Development Best Practices

### Do ✅

- Keep features self-contained
- Use feature public APIs (`index.ts`)
- Keep pages thin (composition only)
- Extract logic to hooks when components get complex
- Use RTK Query for server state
- Write tests for new features

### Don't ❌

- Deep import from features
- Put business logic in pages
- Duplicate layout code
- Prematurely abstract to `shared/`
- Skip verification before committing

## Testing Philosophy

- **Unit tests** - Pure functions, validators, formatters
- **Integration tests** - Component interactions, hooks with state
- **E2E tests** - Critical user journeys, authentication flows

Keep tests close to the code they test in `src/features/<feature>/tests/`

See **[Testing Guide](./development/testing.md)** for detailed strategy.

## Where to Put Code

### Feature-Specific Code

Keep in `src/features/<feature>/`:

- Components used only by this feature
- API endpoints for this feature
- Feature-specific hooks
- Business logic and validators
- Redux slices (if needed)
- Feature types

### Shared Code

Move to `src/shared/` only when:

- Used by 2+ features
- Truly cross-cutting (AppHeader, Footer)
- Generic utilities

**Rule**: Don't prematurely share. Duplication is better than wrong abstraction.

## Troubleshooting

### Build Fails

1. Check for missing imports
2. Verify all routes are registered
3. Run `npm run type-check` for TypeScript errors
4. See **[Troubleshooting](./guides/troubleshooting.md)** for common issues

### Tests Fail

1. Ensure you're using `render-with-providers` for Redux/router components
2. Check for missing test setup in `src/test/setup.ts`
3. Verify mock data matches expected types
4. Never disable tests to make them pass

### Routes Not Working

1. Check route is registered in `src/app/routing/routes.tsx`
2. Verify path is correct
3. Check guards are properly configured
4. Ensure feature exports routes in `index.ts`

## Next Steps

1. **Read** [Architecture Overview](./architecture/overview.md) to understand system design
2. **Review** [Conventions](./development/conventions.md) before coding
3. **Study** [Feature Architecture](./features/features.md) to see existing patterns
4. **Follow** [Adding Features](./guides/adding-features.md) for your first contribution

## Additional Resources

- **[AGENTS.md](../AGENTS.md)** - Agent-specific working standards
- **[Architecture Overview](./architecture/overview.md)** - System design and scorecard
- **[Conventions](./development/conventions.md)** - Naming and organization rules
- **[Testing Guide](./development/testing.md)** - Testing strategy and patterns

## Getting Help

- Check **[Troubleshooting](./guides/troubleshooting.md)** for common issues
- Review **[Best Practices](./quality/best-practices.md)** for guidance
- Refer to feature-specific docs in **[Features](./features/)**
