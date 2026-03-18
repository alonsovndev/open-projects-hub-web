# Frontend Architecture

## Overview

This project follows a **feature-based, scalable architecture** with clear separation of concerns, inspired by screaming architecture principles. Each feature is self-contained and owns its routes, components, state, and API integration.

## Folder Structure

```text
/src
  /app
    /api              # Base API configuration (RTK Query)
    /layouts          # Reusable layout components (PublicLayout, PrivateLayout)
    /routing          # Routing system (AppRouter, GuardResolver, routes aggregator)
    /store            # Redux store configuration and typed hooks
  /shared
    /components       # Truly cross-feature reusable UI
      /layout         # Shared layout components (AppHeader, Footer)
    /hooks            # Cross-feature React hooks
    /utils            # Framework-agnostic utilities
    /types            # Shared TypeScript types
  /features
    /<feature>
      /api            # Feature API integration
      /components     # Feature-owned UI components
      /hooks          # Feature-specific hooks
      /model          # Business logic, calculators, normalizers
      /state          # Redux slices (if needed)
      /types          # Feature type definitions
      routes.tsx      # Feature route definitions
      index.ts        # Feature public API (barrel export)
  /pages
    /<page>
      index.tsx       # Page entry point (thin composition layer)
      <page>.module.scss
  /resources
    /config           # Static configuration and constants
    /mock-data        # Development mock data (deprecated - use RTK Query fakeBaseQuery)
```

## Layer Responsibilities

### 1. `src/app` - Core Application Infrastructure

**Purpose:** Foundation-level code that bootstraps and configures the application.

- **`api/`** - Base RTK Query API configuration (`baseApi`)
- **`layouts/`** - Reusable page layouts:
  - `PublicLayout.tsx` - For public pages (home, login, viewer, unauthorized)
  - `PrivateLayout.tsx` - For authenticated pages (dashboard, admin)
- **`routing/`** - Declarative routing system:
  - `AppRouter.tsx` - Main router component
  - `GuardResolver.tsx` - Unified authentication/authorization guard
  - `routes.tsx` - Central route aggregator
  - `types.ts` - Route type definitions
- **`store/`** - Redux store setup:
  - `store.ts` - Store configuration
  - `hooks.ts` - Typed Redux hooks (`useAppDispatch`, `useAppSelector`)

**Rules:**
- Don't put feature-specific code here
- Keep it generic and reusable
- Changes here should be rare

### 2. `src/shared` - Cross-Feature Shared Code

**Purpose:** Code that is truly used across multiple features (use sparingly).

- **`components/layout/`** - Shared layout components (AppHeader, Footer)
- **`hooks/`** - Cross-feature React hooks
- **`utils/`** - Generic utility functions
- **`types/`** - Shared TypeScript definitions

**Rules:**
- Only promote code here when it's genuinely used by multiple features
- Don't use this as a dumping ground
- Prefer keeping code in features until it's proven to be shared

### 3. `src/features` - Self-Contained Feature Modules ⭐

**Purpose:** Primary development layer where business logic lives.

Each feature is **self-contained** and owns:
- ✅ Routes (`routes.tsx`)
- ✅ Components (feature UI)
- ✅ State (Redux slices if needed)
- ✅ API integration
- ✅ Types
- ✅ Public API (`index.ts`)

**Feature Structure:**
```text
/src/features/auth
  /api
    auth-api.ts       # RTK Query endpoints
  /components
    /login-form
      LoginForm.tsx
      login-form.module.scss
      index.ts
  /hooks
    use-login-form.ts
  /model
    password-strength.ts
  /state
    auth-slice.ts     # Redux slice (if needed)
  /types
    index.ts
  routes.tsx          # Feature route definitions
  index.ts            # Public API exports
```

**Rules:**
- Features should be self-contained (no cross-feature imports)
- Use public APIs (`index.ts`) for exports
- Each feature owns its routes
- Keep feature-specific logic inside the feature

### 4. `src/pages` - Route Entry Points (Composition Layer Only)

**Purpose:** Thin composition layer that connects routes to features.

**Pages should NOT contain:**
- ❌ Business logic
- ❌ Heavy state management
- ❌ API calls
- ❌ Complex UI components
- ❌ Mock data or config

**Pages SHOULD:**
- ✅ Import and compose feature components
- ✅ Handle simple page-level styling
- ✅ Be easy to read and understand

**Example - Good Page:**

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

**Note:** Layouts (PublicLayout/PrivateLayout) are applied in route definitions, not in page files.

### 5. `src/resources` - Static Assets and Configuration

- **`config/`** - Static constants and configuration
- **`mock-data/`** - Development fixtures (prefer RTK Query `fakeBaseQuery` instead)

## Feature-Based Architecture Principles

### Feature Public API Pattern

**Every feature MUST export a public API via `index.ts`:**

```typescript
// features/auth/index.ts
export { authRoutes } from "./routes";
export { authApi, useLoginMutation } from "./api/auth-api";
export { authReducer, setSession, clearSession } from "./state/auth-slice";
export type { LoginValues, UserSession, AuthResponse } from "./types";
```

**Deep imports are forbidden:**

```typescript
// ❌ BAD - Deep import (tight coupling)
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";

// ✅ GOOD - Public API import (loose coupling)
import { LoginForm } from "@/features/auth";
```

### No Cross-Feature Deep Imports

Features should not import from other features. If you need shared code:

1. **First option:** Move it to `shared/` if it's truly cross-feature
2. **Second option:** Duplicate it if it's small (avoid premature abstraction)
3. **Third option:** Rethink your feature boundaries

```typescript
// ❌ BAD - Cross-feature import
import { UserAvatar } from "@/features/users/components/UserAvatar";

// ✅ GOOD - Use shared component
import { UserAvatar } from "@/shared/components/UserAvatar";

// ✅ ALSO GOOD - Use feature public API
import { UserAvatar } from "@/features/users";
```

## Declarative Routing System

### Route Definitions

Each feature owns its routes via `routes.tsx`:

```typescript
// features/auth/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { PublicLayout } from "@/app/layouts";
import { LoginPage } from "@/pages/login";

export const authRoutes: AppRoute[] = [
  {
    path: "/login",
    element: (
      <PublicLayout>
        <LoginPage />
      </PublicLayout>
    ),
    guards: ["guest"],
  },
];
```

### Route Aggregation

Routes from all features are aggregated in `app/routing/routes.tsx`:

```typescript
// app/routing/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { homeRoutes } from "@/features/home/routes";
import { authRoutes } from "@/features/auth/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  // ... other feature routes
];
```

### Guard System

The `GuardResolver` component handles all authentication and authorization:

**Guard Types:**
- `"public"` - Anyone can access (default)
- `"guest"` - Only unauthenticated users (redirects logged-in users to dashboard)
- `"auth"` - Requires authentication (redirects to login)
- `{ role: "admin" }` - Role-based access control (redirects to /unauthorized)

**Examples:**

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

## Layout System

### PublicLayout

Used for public pages (home, login, viewer, unauthorized).

**Features:**
- Includes Footer
- Clean, centered content
- No authentication UI

**Usage (in route definitions):**

```typescript
element: (
  <PublicLayout>
    <HomePage />
  </PublicLayout>
)
```

### PrivateLayout

Used for authenticated pages (dashboard, admin).

**Features:**
- Includes AppHeader with user info
- Sign Out button
- Automatic session display

**Usage (in route definitions):**

```typescript
element: (
  <PrivateLayout>
    <DashboardPage />
  </PrivateLayout>
)
```

## Adding a New Feature

Follow this workflow:

### Step 1: Create Feature Folder Structure

```bash
mkdir -p src/features/my-feature/{components,hooks,types,api,state}
```

### Step 2: Create Feature Routes

```typescript
// features/my-feature/routes.tsx
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

### Step 3: Create Public API

```typescript
// features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
export { MyFeatureComponent } from "./components/MyFeatureComponent";
export type { MyFeatureType } from "./types";
```

### Step 4: Register Routes in Central Aggregator

```typescript
// app/routing/routes.tsx
import { myFeatureRoutes } from "@/features/my-feature";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...myFeatureRoutes,  // ✅ Add here
];
```

### Step 5: Create Page

```typescript
// pages/my-feature/index.tsx
import type { FC } from "react";
import { MyFeatureComponent } from "@/features/my-feature";
import styles from "./my-feature.module.scss";

export const MyFeaturePage: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <MyFeatureComponent />
    </div>
  );
};
```

Done! Your feature is fully integrated. ✅

## Component Structure

### Feature-Owned Components

Keep feature-specific UI inside the feature:

```text
/src/features/auth/components/login-form
  LoginForm.tsx
  login-form.module.scss
  index.ts
```

**Rules:**
1. Use PascalCase for component file names
2. Use kebab-case for component folder names
3. Use kebab-case for stylesheet files
4. Export via `index.ts` barrel

### Shared Components

Only promote components to `shared/` when truly cross-feature:

```text
/src/shared/components/layout/app-header
  AppHeader.tsx
  app-header.module.scss
  index.ts
```

## Component Naming Conventions

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
| Mock data file | kebab-case | `users.ts` |

## Feature Logic and UI Separation

When a feature component starts mixing rendering with validation, navigation, derived state, or data lookup, split responsibilities:

### Recommended Structure:

```text
/src/features/auth
  /components
    /login-form
      LoginForm.tsx         # Presentational component
  /hooks
    use-login-form.ts       # Orchestration logic
  /model
    password-strength.ts    # Pure business logic
  /state
    auth-slice.ts           # Redux state
  /api
    auth-api.ts             # API integration
```

### Rules:

1. **Presentational components** - Focus on JSX, classes, simple display mapping
2. **Hooks** - Feature orchestration, state management, side effects
3. **Model** - Pure business rules, calculators, normalizers, selectors
4. **State** - Redux slices (if needed)
5. **API** - RTK Query endpoints, data fetching

## Data and Configuration Separation

Keep non-UI data out of components.

### Preferred Locations:

```text
/src/resources/config/auth.ts           # Static config
/src/resources/config/welcome-panels.ts # UI configuration
```

### Rules:

1. Static config belongs in `src/resources/config`
2. Mock data belongs in RTK Query `fakeBaseQuery` (not in files)
3. Components should consume data, not define large config blobs inline
4. Feature-specific config can stay in the feature if it's not truly global

## Styling Rules

1. Use **SCSS Modules** with `.module.scss` for page and component styles
2. Use **kebab-case** for stylesheet names
3. Keep global styles in `src/styles` (if needed)
4. Avoid inline styles except for truly dynamic values
5. Prefer semantic HTML structure in JSX

**Example:**

```typescript
import styles from "./login-form.module.scss";

export const LoginForm: FC = () => {
  return (
    <form className={styles.form}>
      <input className={styles.input} />
    </form>
  );
};
```

## UI Library Usage

Use **Ant Design** for behavior-heavy, validated, or data-driven UI.
Use **semantic HTML and SCSS Modules** for marketing, content, and branded sections.

### Use Ant Design For:

1. Forms and validation (`Form`, `Input`, `Select`, `DatePicker`)
2. Data tables and CRUD screens (`Table`, `Pagination`)
3. Modals, drawers, confirmations (`Modal`, `Drawer`, `Popconfirm`)
4. Admin shells, menus, tabs (`Layout`, `Menu`, `Tabs`)

### Use Semantic HTML + SCSS For:

1. Home page sections and hero blocks
2. About, testimonials, and branded informational sections
3. Privacy policy, terms, and similar static content
4. Highly custom visual compositions

### Mixed Usage

Mixing Ant Design with semantic HTML is encouraged:

1. Use semantic sections for layout and storytelling
2. Use Ant Design controls where they provide accessibility, validation, or interaction value
3. Avoid using Ant Design just to make static content feel uniform

## Routing and Navigation

### Page Registration

Pages are automatically registered via feature routes. No manual route registration needed.

### Navigation

Use React Router's navigation:

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
```

### Route Guards

Guards are declarative and handled by `GuardResolver`:

```typescript
// In routes.tsx
{
  path: "/admin",
  element: <PrivateLayout><AdminPage /></PrivateLayout>,
  guards: ["auth", { role: "admin" }]
}
```

## State Management

### Client State (Redux Toolkit)

Use `createSlice` for client-side UI or app state only:

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
    clearSession: (state) => {
      state.session = null;
    },
  },
});
```

### Server State (RTK Query)

Use RTK Query for async server state:

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

## Testing Strategy

1. Feature tests live inside the feature (`features/<feature>/tests/`)
2. Use React Testing Library for component tests
3. Use Vitest for unit tests
4. Keep tests close to the code they test

## Forbidden Patterns

1. ❌ Large page files with embedded feature markup
2. ❌ Inline CSS for standard styling
3. ❌ Cross-feature deep imports
4. ❌ Putting mock data inside components
5. ❌ Skipping feature public APIs
6. ❌ Using `admin-*` or `client-*` prefixes in folder names
7. ❌ Manual route guards (use GuardResolver)
8. ❌ Duplicating layout code in pages (use PublicLayout/PrivateLayout)

## Migration Notes

### From Old Architecture to Feature-Based

If migrating from an older structure:

1. **Remove prefixes:** `admin-auth` → `auth`, `client-viewer` → `viewer`
2. **Move layouts:** `src/components/layout` → `src/shared/components/layout`
3. **Create feature routes:** Add `routes.tsx` to each feature
4. **Create public APIs:** Add `index.ts` to each feature
5. **Update imports:** Use feature public APIs instead of deep imports
6. **Update store:** Change reducer keys (`adminAuth` → `auth`)
7. **Test build:** Ensure everything compiles

## Summary

This architecture achieves:

- ✅ **Feature isolation** - Features are self-contained
- ✅ **Scalability** - Easy to add new features without touching core code
- ✅ **Maintainability** - Clear structure, predictable patterns
- ✅ **Type safety** - Full TypeScript support
- ✅ **DRY** - Layouts eliminate duplication
- ✅ **SOLID principles** - Open/Closed, Single Responsibility
- ✅ **Screaming architecture** - Folder structure reveals business domains
