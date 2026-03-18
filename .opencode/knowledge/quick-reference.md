# Feature-Based Architecture Quick Reference

## Overview

This project uses **feature-based architecture** where each business domain is a self-contained module. This document provides quick reference for common tasks.

## Project Structure

```text
src/
  app/          # Core infrastructure
  shared/       # Cross-feature code
  features/     # Business features (⭐ main workspace)
  pages/        # Route entry points
  resources/    # Static config
```

## Quick Start: Adding a New Feature

### 1. Create Feature Structure

```bash
mkdir -p src/features/my-feature/{components,hooks,types,api,state}
touch src/features/my-feature/routes.tsx
touch src/features/my-feature/index.ts
```

### 2. Define Routes

```typescript
// features/my-feature/routes.tsx
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
// features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
```

### 4. Register Routes

```typescript
// app/routing/routes.tsx
import { myFeatureRoutes } from "@/features/my-feature";

export const appRoutes: AppRoute[] = [
  ...existingRoutes,
  ...myFeatureRoutes,
];
```

### 5. Create Page

```typescript
// pages/my-feature/index.tsx
import type { FC } from "react";

export const MyFeaturePage: FC = () => {
  return <div>My Feature</div>;
};
```

Done! ✅

## Common Patterns

### Route Guards

```typescript
guards: ["public"]                     // Anyone
guards: ["guest"]                      // Unauthenticated only
guards: ["auth"]                       // Authenticated
guards: ["auth", { role: "admin" }]    // Admin only
```

### Layouts

```typescript
// Public pages
<PublicLayout><HomePage /></PublicLayout>

// Authenticated pages
<PrivateLayout><DashboardPage /></PrivateLayout>
```

### Imports

```typescript
// ✅ Use public APIs
import { LoginForm } from "@/features/auth";

// ❌ No deep imports
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";
```

### Feature API Exports

```typescript
// features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
export { MyComponent } from "./components/MyComponent";
export { useMyHook } from "./hooks/use-my-hook";
export type { MyType } from "./types";
```

## File Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Component | PascalCase | `LoginForm.tsx` |
| Component folder | kebab-case | `login-form/` |
| Hook | kebab-case | `use-login-form.ts` |
| Util | kebab-case | `format-date.ts` |
| Config | kebab-case | `auth.ts` |
| Stylesheet | kebab-case | `login-form.module.scss` |
| Feature | kebab-case | `auth/`, `dashboard/` |
| Page | lowercase | `login/`, `dashboard/` |

## Where to Put Code

### Feature-Owned Code

```text
features/my-feature/
  components/   # Feature UI
  hooks/        # Feature hooks
  api/          # API endpoints
  state/        # Redux slices
  model/        # Business logic
  types/        # Types
  routes.tsx    # Routes
  index.ts      # Public API
```

### Shared Code

```text
shared/
  components/   # Cross-feature UI
  hooks/        # Cross-feature hooks
  utils/        # Utilities
  types/        # Shared types
```

**Rule:** Only promote to `shared/` when used by 2+ features.

## State Management

### Client State (Redux)

```typescript
// features/auth/state/auth-slice.ts
const authSlice = createSlice({
  name: "auth",
  initialState: { session: null },
  reducers: { setSession, clearSession },
});
```

### Server State (RTK Query)

```typescript
// features/auth/api/auth-api.ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
```

## Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
```

## Rules to Remember

### Do:

✅ Keep features self-contained
✅ Use feature public APIs
✅ Define routes in `routes.tsx`
✅ Keep pages thin
✅ Use layouts in routes
✅ Use declarative guards

### Don't:

❌ Deep import from features
❌ Use `admin-*` or `client-*` prefixes
❌ Put business logic in pages
❌ Duplicate layout code
❌ Manually check auth (use guards)
❌ Prematurely move to `shared/`

## Architecture Layers

```text
app/       → Infrastructure (routing, layouts, store, API)
shared/    → Cross-feature code (use sparingly)
features/  → Business features (⭐ main workspace)
pages/     → Route entry points (thin composition)
resources/ → Static config and data
```

## Common Tasks

### Add API Endpoint

```typescript
// features/my-feature/api/my-feature-api.ts
export const myFeatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchData: builder.query({
      query: () => "/my-feature/data",
    }),
  }),
});

export const { useFetchDataQuery } = myFeatureApi;
```

### Add Redux State

```typescript
// features/my-feature/state/my-feature-slice.ts
const myFeatureSlice = createSlice({
  name: "myFeature",
  initialState: { data: null },
  reducers: { setData },
});

export const { setData } = myFeatureSlice.actions;
export const myFeatureReducer = myFeatureSlice.reducer;

// Register in store.ts
import { myFeatureReducer } from "@/features/my-feature/state/my-feature-slice";

export const store = configureStore({
  reducer: {
    myFeature: myFeatureReducer,
  },
});
```

### Create Component

```bash
mkdir -p src/features/my-feature/components/my-component
touch src/features/my-feature/components/my-component/MyComponent.tsx
touch src/features/my-feature/components/my-component/my-component.module.scss
touch src/features/my-feature/components/my-component/index.ts
```

```typescript
// MyComponent.tsx
import type { FC } from "react";
import styles from "./my-component.module.scss";

export const MyComponent: FC = () => {
  return <div className={styles.container}>My Component</div>;
};

// index.ts
export { MyComponent } from "./MyComponent";
```

## Guard Behavior

| Guard | Authenticated | Unauthenticated |
| --- | --- | --- |
| `"public"` | ✅ Allow | ✅ Allow |
| `"guest"` | ❌ Redirect to /dashboard | ✅ Allow |
| `"auth"` | ✅ Allow | ❌ Redirect to /login |
| `{ role: "admin" }` | ✅ Allow if admin | ❌ Redirect to /login |
| `{ role: "admin" }` | ❌ Redirect to /unauthorized if not admin | ❌ Redirect to /login |

## Troubleshooting

### Build fails with "Cannot find module"

- Check feature public API exports (`index.ts`)
- Verify import paths use `@/features/...` not relative paths
- Ensure routes are registered in `app/routing/routes.tsx`

### Routes not working

- Check route is registered in `app/routing/routes.tsx`
- Verify path is correct
- Check guards are properly configured

### Component not found

- Check barrel export in `index.ts`
- Verify import uses feature public API
- Ensure component is exported from feature

## Testing Quick Reference

### When to Write Tests

✅ **Always test**:
- Authentication/authorization logic
- Business calculations and validations
- Data mutations (create, update, delete)
- Utility functions (formatters, parsers)
- Custom hooks with logic

⚠️ **Consider testing**:
- Complex UI components (multi-step forms, tables with filters)
- Feature workflows (registration, checkout)
- Error handling

❌ **Don't test**:
- Simple presentational components
- Third-party libraries
- Static configuration

### Where to Put Tests

```
src/features/my-feature/
  tests/
    my-feature-api.test.ts       # API tests
    my-feature-slice.test.ts     # Redux tests
    validators.test.ts           # Model tests
    MyComponent.test.tsx         # Component tests
```

### Quick Test Example

```typescript
// Pure function test
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('should format amount correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});
```

### Run Tests

```bash
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:coverage  # Run with coverage report
npm run verify         # Run tests + build
```

### Learn More

- **Testing Strategy:** `.opencode/knowledge/testing-strategy.md` - When and what to test
- **Testing Setup:** `.opencode/skills/testing-setup.md` - How to configure and write tests

## Resources

- **Architecture:** `.opencode/knowledge/frontend-architecture.md`
- **Preferences:** `.opencode/knowledge/project-preferences.md`
- **Testing Strategy:** `.opencode/knowledge/testing-strategy.md`
- **Routing:** `.opencode/skills/routing-pages.md`
- **Components:** `.opencode/skills/component-boundaries.md`
- **Testing Setup:** `.opencode/skills/testing-setup.md`
