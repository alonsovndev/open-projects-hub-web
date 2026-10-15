# Folder Structure

Detailed guide to the Open Projects Hub Web project organization and layer responsibilities.

## Overview

The project follows **feature-based architecture** with clear separation of concerns:

```text
src/
  app/          # Core infrastructure
  features/     # Business domains (⭐ primary workspace)
  pages/        # Route entry points
  shared/       # Cross-feature code
  resources/    # Static config
  styles/       # Global styles
  test/         # Test utilities
```

## Complete Structure

```text
src/
  app/
    api/
      base-api.ts              # RTK Query base configuration
    layouts/
      PublicLayout.tsx         # Layout for public pages
      admin-layout/            # Sidebar layout for authenticated pages
      index.ts
    routing/
      AppRouter.tsx            # Router component
      GuardResolver.tsx        # Auth/role guards
      routes.tsx               # Route aggregator
      types.ts                 # Route types
    providers/                 # Context providers
    store/
      store.ts                 # Redux store config
      hooks.ts                 # Typed Redux hooks

  shared/
    components/
      layout/
        app-header/            # Authenticated header
          AppHeader.tsx
          app-header.module.scss
          index.ts
        footer/                # Shared footer
          Footer.tsx
          footer.module.scss
          index.ts
      ui/                      # Reusable UI primitives
        app-button/
          AppButton.tsx
          app-button.module.scss
          index.ts
    hooks/                     # Cross-feature hooks
    utils/                     # Generic utilities
    types/                     # Shared types

  features/
    auth/
      api/
        auth-api.ts            # Auth API endpoints
      components/
        admin-login-form/
          AdminLoginForm.tsx
          admin-login-form.module.scss
          index.ts
      hooks/
        use-admin-login-form.ts
      model/
        password-policy.ts     # Pure validation logic
        password-strength.ts
      state/
        auth-slice.ts          # Redux slice
      tests/
        password-policy.test.ts
      types/
        index.ts
      routes.tsx               # Auth routes
      index.ts                 # Public API

    dashboard/
      components/
        project-list/
          ProjectList.tsx
          project-list.module.scss
          index.ts
      hooks/
        use-dashboard.ts
      types/
        index.ts
      routes.tsx
      index.ts

    home/
      components/
        home-hero/
        home-workflow/
      pages/
      routes.tsx

    viewer/
      api/
        viewer-api.ts
      components/
        client-viewer-portal/
        project-code-search/
        requirements-viewer/
      model/
        project-code.ts
      tests/
        project-code.test.ts
      types/
        index.ts
      routes.tsx
      index.ts

  pages/
    home/
      index.tsx
      home.module.scss
    login/
      index.tsx
      login.module.scss
    dashboard/
      index.tsx
      dashboard.module.scss
    viewer/
      index.tsx
      viewer.module.scss
    unauthorized/
      index.tsx
      unauthorized.module.scss

  resources/
    config/
      auth.ts                  # Auth configuration
      welcome-panels.ts        # UI config data
    mock-data/                 # Development fixtures (deprecated)
      all-clinic-services.ts

  styles/
    global.scss                # Global styles

  test/
    setup.ts                   # Test configuration
    utils/
      render-with-providers.tsx  # Test helpers
    mocks/
      redux-mock.ts
      handlers.ts
```

## Layer Responsibilities

### 1. `src/app/` - Core Application Infrastructure

**Purpose**: Foundation-level code that bootstraps and configures the application.

**Contains**:

- **`api/`** - Base RTK Query API configuration with auth headers
- **`layouts/`** - Reusable page layouts (`PublicLayout`, `AdminLayout`)
- **`routing/`** - Declarative routing system with guards
- **`store/`** - Redux store setup and typed hooks
- **`providers/`** - React context providers (if needed)

**Rules**:

- Don't put feature-specific code here
- Keep it generic and reusable
- Changes here should be rare
- Focus on cross-cutting infrastructure

**Example Files**:

```typescript
// app/api/base-api.ts
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      // Add auth token
      return headers;
    },
  }),
  endpoints: () => ({}),
});

// app/store/store.ts
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

// app/store/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### 2. `src/shared/` - Cross-Feature Shared Code

**Purpose**: Code that is truly used across multiple features (use sparingly).

**Contains**:

- **`components/layout/`** - Shared layout components (AppHeader, Footer)
- **`components/ui/`** - Generic UI primitives (AppButton, AppModal)
- **`hooks/`** - Cross-feature React hooks
- **`utils/`** - Framework-agnostic utilities
- **`types/`** - Shared TypeScript definitions

**Rules**:

- Only promote code here when used by 2+ features
- Don't use as a dumping ground
- Keep features until proven shared
- Favor duplication over wrong abstraction

**When to Use**:

```typescript
// ✅ Good - Truly shared layout
// src/shared/components/layout/app-header/AppHeader.tsx
export const AppHeader: FC = () => {
  // Used by all authenticated pages
};

// ✅ Good - Generic utility
// src/shared/utils/format-date.ts
export const formatDate = (date: Date) => {
  // Used across features
};

// ❌ Bad - Feature-specific
// src/shared/components/login-button/
// Keep in src/features/auth/components/ instead
```

---

### 3. `src/features/` - Self-Contained Feature Modules ⭐

**Purpose**: Primary development layer where business logic lives.

**Contains (per feature)**:

- **`api/`** - RTK Query endpoints
- **`components/`** - Feature UI
- **`hooks/`** - Feature-specific hooks
- **`model/`** - Pure business logic
- **`state/`** - Redux slices (if needed)
- **`tests/`** - Feature tests
- **`types/`** - Feature types
- **`routes.tsx`** - Route definitions
- **`index.ts`** - Public API exports

**Rules**:

- Features should be self-contained (no cross-feature imports)
- Use public APIs (`index.ts`) for exports
- Each feature owns its routes
- Keep feature-specific logic inside the feature
- Tests live alongside the code they test

**Feature Structure Example**:

```typescript
// features/auth/routes.tsx
export const authRoutes: AppRoute[] = [
  {
    path: "/login",
    element: <PublicLayout><LoginPage /></PublicLayout>,
    guards: ["guest"],
  },
];

// features/auth/index.ts (Public API)
export { authRoutes } from "./routes";
export { authApi, useLoginMutation } from "./api/auth-api";
export { authReducer, setSession, clearSession } from "./state/auth-slice";
export type { LoginValues, UserSession } from "./types";

// Other features import from public API only:
import { useLoginMutation } from "@/features/auth";  // ✅ Good
```

**Component Organization**:

```text
features/auth/components/
  admin-login-form/
    AdminLoginForm.tsx         # Presentational component
    admin-login-form.module.scss
    index.ts                   # Barrel export
```

**Model Layer** (Pure Logic):

```typescript
// features/auth/model/password-policy.ts
export const validatePassword = (password: string): ValidationResult => {
  // Pure validation logic - easy to test
};
```

---

### 4. `src/pages/` - Route Entry Points (Composition Layer Only)

**Purpose**: Thin composition layer that connects routes to features.

**Contains**: One `index.tsx` and one `.module.scss` per route

**Pages Should NOT Contain**:

- ❌ Business logic
- ❌ Heavy state management
- ❌ API calls
- ❌ Complex UI components
- ❌ Mock data or config

**Pages SHOULD**:

- ✅ Import and compose feature components
- ✅ Handle simple page-level styling
- ✅ Be easy to read and understand

**Example - Good Page**:

```typescript
// pages/dashboard/index.tsx
import type { FC } from "react";
import { WelcomePanel } from "@/features/dashboard";
import styles from "./dashboard.module.scss";

export const DashboardPage: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <WelcomePanel />
    </div>
  );
};
```

**Note**: Layouts (PublicLayout/AdminLayout) are applied in route definitions, not in page files.

---

### 5. `src/resources/` - Static Assets and Configuration

**Purpose**: Static constants, configuration, and seed-like UI content.

**Contains**:

- **`config/`** - Static constants and configuration
- **`mock-data/`** - Development fixtures (prefer RTK Query `fakeBaseQuery`)

**Rules**:

- Keep non-UI data out of components
- Configuration should be importable and typed
- Mock data is deprecated in favor of API mocking

**Example**:

```typescript
// resources/config/auth.ts
export const AUTH_CONFIG = {
  storageKey: "open-projects-hub.admin-session",
  endpoints: {
    login: "/auth/login",
    logout: "/auth/logout",
  },
} as const;
```

---

### 6. `src/test/` - Test Utilities and Setup

**Purpose**: Shared test helpers, mocks, and configuration.

**Contains**:

- **`setup.ts`** - Global test configuration
- **`utils/`** - Test helpers (render-with-providers)
- **`mocks/`** - Shared test mocks

**Example**:

```typescript
// test/utils/render-with-providers.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState, store, ...options }: RenderOptions = {}
) => {
  // Wraps component with Redux + Router
};
```

---

## Feature Public API Pattern

**Every feature MUST export a public API via `index.ts`**:

```typescript
// features/auth/index.ts
export { authRoutes } from "./routes";
export { authApi, useLoginMutation } from "./api/auth-api";
export { authReducer, setSession, clearSession } from "./state/auth-slice";
export type { LoginValues, UserSession, AuthResponse } from "./types";
```

**Deep imports are forbidden**:

```typescript
// ❌ BAD - Deep import (tight coupling)
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";

// ✅ GOOD - Public API import (loose coupling)
import { LoginForm } from "@/features/auth";
```

---

## No Cross-Feature Deep Imports

Features should not import from other features. If you need shared code:

1. **First option**: Move it to `shared/` if it's truly cross-feature
2. **Second option**: Duplicate it if it's small (avoid premature abstraction)
3. **Third option**: Rethink your feature boundaries

```typescript
// ❌ BAD - Cross-feature import
import { UserAvatar } from "@/features/users/components/UserAvatar";

// ✅ GOOD - Use shared component
import { UserAvatar } from "@/shared/components/UserAvatar";

// ✅ ALSO GOOD - Use feature public API
import { UserAvatar } from "@/features/users";
```

---

## File Naming Conventions

| Type             | Convention | Example                  |
| ---------------- | ---------- | ------------------------ |
| Component file   | PascalCase | `LoginForm.tsx`          |
| Component folder | kebab-case | `login-form/`            |
| Hook file        | kebab-case | `use-login-form.ts`      |
| Utility file     | kebab-case | `format-date.ts`         |
| Config file      | kebab-case | `auth.ts`                |
| Stylesheet       | kebab-case | `login-form.module.scss` |
| Feature folder   | kebab-case | `auth/`, `dashboard/`    |
| Page folder      | lowercase  | `login/`, `dashboard/`   |

---

## Decision Trees

### Where Should This Component Live?

```
Is it used by multiple features?
  ├─ NO  → Keep in features/<feature>/components/
  └─ YES → Is it generic UI (button, modal, card)?
       ├─ YES → shared/components/ui/
       └─ NO  → Is it layout/navigation?
            ├─ YES → shared/components/layout/
            └─ NO  → Keep in feature until proven shared
```

### Where Should This Hook Live?

```
Is it used by multiple features?
  ├─ NO  → features/<feature>/hooks/
  └─ YES → shared/hooks/
```

### Where Should This Util Live?

```
Is it framework-agnostic and generic?
  ├─ YES → shared/utils/
  └─ NO  → Is it feature-specific business logic?
       ├─ YES → features/<feature>/model/
       └─ NO  → features/<feature>/hooks/ (if React-dependent)
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Large Page Files

```typescript
// pages/dashboard/index.tsx (BAD)
export const DashboardPage = () => {
  // 500 lines of JSX, state, effects...
  // This should be in features/dashboard/
};
```

### ❌ Don't: Deep Feature Imports

```typescript
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";
```

### ❌ Don't: Premature Abstraction

```typescript
// shared/components/user-profile-card/  (BAD)
// Only used by dashboard feature - keep it there until proven shared
```

### ❌ Don't: Cross-Feature Coupling

```typescript
// features/dashboard/components/DashboardView.tsx (BAD)
import { UserList } from "@/features/users/components/UserList";
// Use feature public API or shared components instead
```

---

## Migration Checklist

When refactoring existing code:

- [ ] Remove `admin-*` and `client-*` prefixes
- [ ] Create `routes.tsx` for each feature
- [ ] Create `index.ts` public API for each feature
- [ ] Update imports to use feature public APIs
- [ ] Move layouts to route definitions
- [ ] Keep pages thin (composition only)
- [ ] Update Redux store keys (remove prefixes)
- [ ] Verify build compiles

---

## Related Documentation

- **[Architecture Overview](./overview.md)** - System design and scorecard
- **[Routing](./routing.md)** - Declarative routing patterns
- **[State Management](./state-management.md)** - Redux + RTK Query
- **[Conventions](../development/conventions.md)** - Naming and imports
- **[Adding Features](../guides/adding-features.md)** - Step-by-step workflow

---

## Summary

This architecture achieves:

- ✅ **Feature isolation** - Features are self-contained
- ✅ **Scalability** - Easy to add new features without touching core code
- ✅ **Maintainability** - Clear structure, predictable patterns
- ✅ **Type safety** - Full TypeScript support
- ✅ **DRY** - Layouts and public APIs eliminate duplication
- ✅ **SOLID principles** - Open/Closed, Single Responsibility
- ✅ **Screaming architecture** - Folder structure reveals business domains
