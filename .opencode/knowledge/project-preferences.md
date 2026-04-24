# Project Preferences

This file captures the preferred project structure, naming conventions, and development workflow.

## Architecture Style

This project follows **feature-based architecture** (screaming architecture):

- **Features are self-contained** - Each feature owns routes, components, state, API
- **No cross-feature deep imports** - Use public APIs (`index.ts`)
- **Declarative routing** - Routes defined as data in `routes.tsx`
- **Layout reuse** - PublicLayout and PrivateLayout eliminate duplication
- **Clean separation** - app / shared / features / pages layers

## Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Component file | PascalCase | `LoginForm.tsx` |
| Component folder | kebab-case | `login-form/` |
| Stylesheet | kebab-case | `login-form.module.scss` |
| Page folder | lowercase/kebab-case | `dashboard/`, `admin-panel/` |
| Page file | `index.tsx` | `index.tsx` |
| Utility file | kebab-case | `format-date.ts` |
| Hook file | kebab-case | `use-login-form.ts` |
| Config file | kebab-case | `auth.ts` |
| Feature folder | kebab-case (no prefixes) | `auth/`, `dashboard/`, `viewer/` |

### Forbidden Naming Patterns

❌ **Do NOT use redundant prefixes:**
- `admin-auth` → Use `auth` instead
- `client-viewer` → Use `viewer` instead
- `admin-dashboard` → Use `dashboard` instead

✅ **Use clean, descriptive names:**
- `auth/` - Authentication feature
- `dashboard/` - Dashboard feature
- `viewer/` - Viewer feature

## Directory Structure

### Core Layers

```text
src/
  app/          # Core infrastructure (routing, layouts, store, API)
  shared/       # Cross-feature shared code (use sparingly)
  features/     # Primary development layer (feature modules)
  pages/        # Route entry points (thin composition)
  resources/    # Static config and mock data
```

### Feature Structure

Each feature follows this structure:

```text
features/<feature>/
  api/          # RTK Query endpoints
  components/   # Feature-owned UI
  hooks/        # Feature-specific hooks
  model/        # Business logic
  state/        # Redux slices (if needed)
  types/        # Type definitions
  routes.tsx    # Route definitions
  index.ts      # Public API exports
```

### Responsibilities

1. **`src/app`** - Core infrastructure only (routing, layouts, store, API base)
2. **`src/shared`** - Truly cross-feature code (AppHeader, Footer, shared hooks)
3. **`src/features`** - Business logic and feature-specific UI (primary workspace)
4. **`src/pages`** - Route composition only (thin layer)
5. **`src/resources/config`** - Static configuration
6. **`src/resources/mock-data`** - Mock data (deprecated - use RTK Query instead)

## Styling

1. Use **SCSS Modules** with `.module.scss` for page and component styles
2. Keep styles colocated with the page or component that owns them
3. Use **kebab-case** for stylesheet file names
4. Avoid inline CSS for standard styling
5. Use semantic HTML structure

**Example:**

```typescript
import styles from "./login-form.module.scss";

export const LoginForm: FC = () => {
  return <form className={styles.form}>...</form>;
};
```

## Component Design

### Keep Components Focused

1. Components should do **one thing well**
2. Split components when they handle multiple concerns
3. Separate static config and mock data from presentation code
4. Use barrel exports (`index.ts`) for cleaner imports
5. Extract orchestration logic to hooks when components become state-heavy
6. Keep pure business logic in `model/` files

### Component Placement Rules

**Feature-Owned Components:**
- Live in `features/<feature>/components/`
- Used only by that feature
- Not exported in feature public API unless needed by pages

**Shared Components:**
- Live in `shared/components/`
- Used by multiple features
- Truly cross-feature (not just "might be reused")

**Don't prematurely share:**
- Keep components in features until they're proven to be shared
- Duplication is better than wrong abstraction

## Routing Workflow

### Creating a New Route/Feature

1. **Create feature folder:**
   ```bash
   mkdir -p src/features/my-feature/{components,hooks,types,api,state}
   ```

2. **Create feature routes (`routes.tsx`):**
   ```typescript
   import type { AppRoute } from "@/app/routing/types";
   import { PrivateLayout } from "@/app/layouts";
   import { MyFeaturePage } from "@/pages/my-feature";

   export const myFeatureRoutes: AppRoute[] = [
     {
       path: "/my-feature",
       element: (
         <PrivateLayout>
           <MyFeaturePage />
         </PrivateLayout>
       ),
       guards: ["auth"],
     },
   ];
   ```

3. **Create public API (`index.ts`):**
   ```typescript
   export { myFeatureRoutes } from "./routes";
   export { MyFeatureComponent } from "./components/MyFeatureComponent";
   ```

4. **Register routes:**
   ```typescript
   // app/routing/routes.tsx
   import { myFeatureRoutes } from "@/features/my-feature";
   
   export const appRoutes: AppRoute[] = [
     ...homeRoutes,
     ...myFeatureRoutes,  // Add here
   ];
   ```

5. **Create page:**
   ```typescript
   // pages/my-feature/index.tsx
   import type { FC } from "react";
   import { MyFeatureComponent } from "@/features/my-feature";
   
   export const MyFeaturePage: FC = () => {
     return <MyFeatureComponent />;
   };
   ```

## Imports

### Import Order

1. External imports (React, third-party libraries)
2. Internal imports (grouped by layer)
3. Types
4. Styles

**Example:**

```typescript
import type { FC } from "react";
import { Button } from "antd";

import { AppHeader } from "@/shared/components/layout/app-header";
import { useAppDispatch } from "@/app/store/hooks";
import { LoginForm } from "@/features/auth";

import type { UserSession } from "@/features/auth";

import styles from "./dashboard.module.scss";
```

### Import Rules

✅ **Use absolute imports:**
```typescript
import { LoginForm } from "@/features/auth";
```

❌ **Avoid relative imports for cross-module:**
```typescript
import { LoginForm } from "../../../features/auth";
```

✅ **Use feature public APIs:**
```typescript
import { LoginForm } from "@/features/auth";
```

❌ **Avoid deep imports:**
```typescript
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";
```

## State Management

### Client State (Redux Toolkit)

Use `createSlice` for:
- UI preferences
- Temporary wizard state
- Auth/session state
- Cross-page client state

**Example:**

```typescript
// features/auth/state/auth-slice.ts
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { session: null },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});
```

### Server State (RTK Query)

Use RTK Query for:
- Fetching feature data
- Caching server responses
- Loading and error state management
- Invalidation and refetch flows

**Example:**

```typescript
// features/auth/api/auth-api.ts
import { baseApi } from "@/app/api/base-api";

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

export const { useLoginMutation } = authApi;
```

### Avoid

❌ `createAsyncThunk` for routine fetching (use RTK Query instead)
❌ Fetching everything in a page and passing it downward
❌ Mixing UI-only config with backend mock data

## UI Library Preference

### Use Ant Design For:

1. **Forms and validation** - `Form`, `Input`, `Select`, `DatePicker`
2. **Data tables** - `Table`, `Pagination`
3. **Overlays** - `Modal`, `Drawer`, `Popconfirm`, `notification`
4. **Admin layouts** - `Layout`, `Menu`, `Tabs`, `Breadcrumb`

### Use Semantic HTML + SCSS For:

1. **Marketing sections** - Hero blocks, testimonials
2. **Content pages** - About, privacy policy, terms
3. **Branded layouts** - Custom visual compositions

### Decision Framework

Ask these questions before choosing:

1. Is this data-driven or CRUD-related? → **Ant Design**
2. Does it need validation or complex state? → **Ant Design**
3. Is this marketing or branded content? → **Semantic HTML**
4. Is this a static informational page? → **Semantic HTML**

## Routing Guards

Use declarative guards in route definitions:

```typescript
// Public route (anyone)
guards: ["public"]

// Guest-only route (login page)
guards: ["guest"]

// Auth-required route
guards: ["auth"]

// Admin-only route
guards: ["auth", { role: "admin" }]
```

Guards are handled automatically by `GuardResolver` - no manual guard components needed.

## Layout System

Use layouts in route definitions:

### PublicLayout

For public pages (home, login, viewer, unauthorized):

```typescript
element: (
  <PublicLayout>
    <HomePage />
  </PublicLayout>
)
```

### PrivateLayout

For authenticated pages (dashboard, admin):

```typescript
element: (
  <PrivateLayout>
    <DashboardPage />
  </PrivateLayout>
)
```

## Testing

1. Feature tests live inside the feature (`features/<feature>/tests/`)
2. Use React Testing Library for component tests
3. Use Vitest for unit tests
4. Keep tests close to the code they test

## Best Practices

### Do:

✅ Keep features self-contained
✅ Use feature public APIs (`index.ts`)
✅ Create routes in feature `routes.tsx`
✅ Use layouts in route definitions
✅ Keep pages thin (composition only)
✅ Extract logic to hooks when components get complex
✅ Use RTK Query for server state
✅ Use descriptive, clean names

### Don't:

❌ Use redundant prefixes (`admin-*`, `client-*`)
❌ Deep import from features
❌ Put business logic in pages
❌ Duplicate layout code in pages
❌ Mix UI and data in components
❌ Prematurely abstract to `shared/`
❌ Use manual guard components (use declarative guards)

## Migration Checklist

When refactoring existing code:

- [ ] Remove `admin-*` and `client-*` prefixes
- [ ] Create `routes.tsx` for each feature
- [ ] Create `index.ts` public API for each feature
- [ ] Update imports to use feature public APIs
- [ ] Move layouts to route definitions
- [ ] Use `GuardResolver` instead of manual guards
- [ ] Update Redux store keys (remove `admin` prefix)
- [ ] Test build to ensure everything compiles

## Summary

This project values:

- **Feature isolation** - Self-contained modules
- **Clean architecture** - Clear layer separation
- **Scalability** - Easy to add new features
- **Maintainability** - Predictable structure
- **Type safety** - Full TypeScript
- **DRY** - Layouts and public APIs
- **SOLID** - Open/Closed, Single Responsibility
