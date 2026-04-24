# Routing and Pages

## Goal

Create route pages that are simple, scalable, and aligned with feature-based architecture.

## Overview

This project uses a **declarative routing system** where:
- Routes are defined in feature `routes.tsx` files
- Routes are aggregated in `app/routing/routes.tsx`
- Pages are thin composition layers
- Layouts are applied in route definitions
- Guards are declarative (no manual guard components)

## Page Template

```text
src/pages/<page>/
  index.tsx
  <page>.module.scss
```

Example:

```text
src/pages/dashboard/
  index.tsx
  dashboard.module.scss
```

## Page Structure Rules

### Pages Should:

✅ Import and compose feature components
✅ Handle simple page-level styling
✅ Be easy to read and understand (< 30 lines ideal)
✅ Use lowercase or kebab-case folder names

### Pages Should NOT:

❌ Contain business logic
❌ Make API calls
❌ Manage complex state
❌ Include layout code (use layouts in routes)
❌ Include route guards (use guards in routes)

## Good Page Example

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

## Bad Page Example

```typescript
// ❌ BAD - Too much logic, layout, and guards
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/shared/components/layout/app-header";
import { Footer } from "@/shared/components/layout/footer";
import { useAppSelector } from "@/app/store/hooks";

export const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.auth.session);
  const [data, setData] = useState(null);

  // ❌ Auth guard logic in page
  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  // ❌ API call in page
  useEffect(() => {
    fetch("/api/data").then((res) => res.json()).then(setData);
  }, []);

  // ❌ Layout in page
  return (
    <>
      <AppHeader />
      <main>
        {/* ❌ Complex UI in page */}
        <div className="dashboard">
          <h1>Welcome, {session?.email}</h1>
          {data ? <pre>{JSON.stringify(data)}</pre> : "Loading..."}
        </div>
      </main>
      <Footer />
    </>
  );
};
```

## Feature Route Definition

Routes are defined in each feature's `routes.tsx`:

```typescript
// features/dashboard/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { DashboardPage } from "@/pages/dashboard";

export const dashboardRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: (
      <PrivateLayout>
        <DashboardPage />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
];
```

### Route Properties

- **`path`** - Route path (e.g., `/dashboard`, `/profile/:id`)
- **`element`** - React element to render (wrapped in layout)
- **`guards`** - Array of guard types (declarative auth/role checks)

### Layout Options

**PublicLayout** - For public pages:
```typescript
element: (
  <PublicLayout>
    <HomePage />
  </PublicLayout>
)
```

**PrivateLayout** - For authenticated pages:
```typescript
element: (
  <PrivateLayout>
    <DashboardPage />
  </PrivateLayout>
)
```

### Guard Options

```typescript
guards: ["public"]                     // Anyone can access (default)
guards: ["guest"]                      // Only unauthenticated users
guards: ["auth"]                       // Requires authentication
guards: ["auth", { role: "admin" }]    // Admin only
```

## Routing Workflow

### Step 1: Create Feature Route

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

### Step 2: Export Routes in Feature Public API

```typescript
// features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
export { MyFeatureComponent } from "./components/MyFeatureComponent";
```

### Step 3: Register Routes in Central Aggregator

```typescript
// app/routing/routes.tsx
import { myFeatureRoutes } from "@/features/my-feature";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...myFeatureRoutes,  // ✅ Add here
];
```

### Step 4: Create Page

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

Done! Your route is fully integrated.

## Multi-Route Features

Features can define multiple routes:

```typescript
// features/profile/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { PrivateLayout } from "@/app/layouts";
import { ProfilePage } from "@/pages/profile";
import { ProfileEditPage } from "@/pages/profile-edit";

export const profileRoutes: AppRoute[] = [
  {
    path: "/profile",
    element: (
      <PrivateLayout>
        <ProfilePage />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
  {
    path: "/profile/edit",
    element: (
      <PrivateLayout>
        <ProfileEditPage />
      </PrivateLayout>
    ),
    guards: ["auth"],
  },
];
```

## Dynamic Routes

Use React Router params:

```typescript
// features/user/routes.tsx
{
  path: "/user/:id",
  element: (
    <PrivateLayout>
      <UserDetailPage />
    </PrivateLayout>
  ),
  guards: ["auth"],
}

// In component:
import { useParams } from "react-router-dom";

const { id } = useParams<{ id: string }>();
```

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleClick = () => {
  navigate("/dashboard");
};
```

### Link Navigation

```typescript
import { Link } from "react-router-dom";

<Link to="/dashboard">Go to Dashboard</Link>
```

## Error Routes

Define error routes in the central aggregator:

```typescript
// app/routing/routes.tsx
export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  // Error routes
  {
    path: "/unauthorized",
    element: (
      <PublicLayout>
        <UnauthorizedPage />
      </PublicLayout>
    ),
    guards: ["public"],
  },
  {
    path: "*",
    element: (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    ),
    guards: ["public"],
  },
];
```

## Guard Behavior

The `GuardResolver` component automatically handles:

### Guest Guard (`"guest"`)
- Redirects authenticated users to `/dashboard`
- Used for login/register pages

### Auth Guard (`"auth"`)
- Redirects unauthenticated users to `/login`
- Used for protected pages

### Role Guard (`{ role: "admin" }`)
- Requires authentication first
- Checks user role
- Redirects to `/unauthorized` if role doesn't match

## Placeholder Guidance

When a route is not built yet:

1. Still create the real page folder structure
2. Use SCSS Modules instead of inline styles
3. Include a clear placeholder heading
4. Provide navigation back to home if needed

```typescript
// pages/coming-soon/index.tsx
import type { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./coming-soon.module.scss";

export const ComingSoonPage: FC = () => {
  return (
    <div className={styles.container}>
      <h1>Coming Soon</h1>
      <p>This feature is under development.</p>
      <Link to="/">Return Home</Link>
    </div>
  );
};
```

## Best Practices

### Do:

✅ Keep pages thin (composition only)
✅ Define routes in feature `routes.tsx`
✅ Use layouts in route definitions
✅ Use declarative guards
✅ Export routes in feature public API
✅ Register routes in central aggregator
✅ Use SCSS Modules for styling

### Don't:

❌ Put business logic in pages
❌ Make API calls in pages
❌ Include layout code in pages
❌ Manually check auth in pages (use guards)
❌ Deep import pages from features
❌ Use inline styles

## Migration from Old System

If migrating from manual guards:

**Old way:**
```typescript
<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <AppHeader />
      <DashboardPage />
      <Footer />
    </AuthGuard>
  }
/>
```

**New way:**
```typescript
// In features/dashboard/routes.tsx
{
  path: "/dashboard",
  element: (
    <PrivateLayout>
      <DashboardPage />
    </PrivateLayout>
  ),
  guards: ["auth"]
}
```

## Summary

This routing system achieves:

- ✅ **Declarative routes** - Routes as data, not scattered JSX
- ✅ **Feature ownership** - Each feature owns its routes
- ✅ **Layout reuse** - No duplication of AppHeader/Footer
- ✅ **Guard composition** - Declarative auth and role checks
- ✅ **Scalability** - Easy to add new routes
- ✅ **Type safety** - Full TypeScript support
- ✅ **Clean pages** - Pages stay thin and focused
