# Routing

Declarative routing system with feature-owned routes and centralized guards.

## Overview

The routing system is **feature-owned but app-assembled**:

1. Each feature defines its own routes in `routes.tsx`
2. Routes are aggregated in `src/app/routing/routes.tsx`
3. `AppRouter` maps routes to React Router elements
4. `GuardResolver` enforces authentication and authorization

## Route Flow

```text
Feature routes.tsx → Central aggregator → AppRouter → GuardResolver → Page
```

## Defining Routes

### Feature Route Definition

Each feature exports routes from `routes.tsx`:

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

Routes from all features are aggregated centrally:

```typescript
// app/routing/routes.tsx
import type { AppRoute } from "./types";
import { homeRoutes } from "@/features/home";
import { authRoutes } from "@/features/auth";
import { dashboardRoutes } from "@/features/dashboard";
import { viewerRoutes } from "@/features/viewer";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...viewerRoutes,
];
```

### Router Component

`AppRouter` maps the route list into React Router elements:

```typescript
// app/routing/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import { GuardResolver } from "./GuardResolver";
import { appRoutes } from "./routes";

export const AppRouter: FC = () => {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <GuardResolver guards={route.guards ?? ["public"]}>
              {route.element}
            </GuardResolver>
          }
        />
      ))}
    </Routes>
  );
};
```

## Guard System

### Overview

`GuardResolver` centralizes all authentication and authorization logic.

### Supported Guards

| Guard               | Behavior                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| `"public"`          | Anyone can access (default)                                            |
| `"guest"`           | Only unauthenticated users (redirects logged-in users to `/dashboard`) |
| `"auth"`            | Requires authentication (redirects to `/login`)                        |
| `{ role: "admin" }` | Role-based access (redirects mismatched roles to `/unauthorized`)      |

### Guard Examples

```typescript
// Public route (anyone)
{
  path: "/",
  element: <PublicLayout><HomePage /></PublicLayout>,
  guards: ["public"],
}

// Guest-only route (login page)
{
  path: "/login",
  element: <PublicLayout><LoginPage /></PublicLayout>,
  guards: ["guest"],
}

// Auth-required route
{
  path: "/dashboard",
  element: <PrivateLayout><DashboardPage /></PrivateLayout>,
  guards: ["auth"],
}

// Admin-only route
{
  path: "/admin",
  element: <PrivateLayout><AdminPage /></PrivateLayout>,
  guards: ["auth", { role: "admin" }],
}
```

### Guard Behavior Table

| Guard               | Authenticated User                                         | Unauthenticated User    |
| ------------------- | ---------------------------------------------------------- | ----------------------- |
| `"public"`          | ✅ Allow                                                   | ✅ Allow                |
| `"guest"`           | ❌ Redirect to `/dashboard`                                | ✅ Allow                |
| `"auth"`            | ✅ Allow                                                   | ❌ Redirect to `/login` |
| `{ role: "admin" }` | ✅ Allow if admin<br>❌ Redirect to `/unauthorized` if not | ❌ Redirect to `/login` |

### GuardResolver Implementation

```typescript
// app/routing/GuardResolver.tsx
export const GuardResolver: FC<GuardResolverProps> = ({ guards, children }) => {
  const session = useAppSelector((state) => state.auth.session);
  const navigate = useNavigate();

  useEffect(() => {
    guards.forEach((guard) => {
      if (guard === "guest" && session) {
        navigate("/dashboard");
      }
      if (guard === "auth" && !session) {
        navigate("/login");
      }
      if (typeof guard === "object" && guard.role) {
        if (!session) {
          navigate("/login");
        } else if (session.role !== guard.role) {
          navigate("/unauthorized");
        }
      }
    });
  }, [guards, session, navigate]);

  return <>{children}</>;
};
```

## Layout System

### PublicLayout

Used for public pages (home, login, viewer, unauthorized).

**Features**:

- Includes Footer
- Clean, centered content
- No authentication UI

**Usage (in route definitions)**:

```typescript
element: (
  <PublicLayout>
    <HomePage />
  </PublicLayout>
)
```

### PrivateLayout

Used for authenticated pages (dashboard, admin).

**Features**:

- Includes AppHeader with user info
- Sign Out button
- Automatic session display

**Usage (in route definitions)**:

```typescript
element: (
  <PrivateLayout>
    <DashboardPage />
  </PrivateLayout>
)
```

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from "react-router-dom";

const MyComponent: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

### Link Navigation

```typescript
import { Link } from "react-router-dom";

<Link to="/dashboard">Dashboard</Link>
```

## Adding a New Route

### Step 1: Create Route Definition

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

### Step 2: Export from Feature Public API

```typescript
// features/my-feature/index.ts
export { myFeatureRoutes } from "./routes";
```

### Step 3: Register in Central Aggregator

```typescript
// app/routing/routes.tsx
import { myFeatureRoutes } from "@/features/my-feature";

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...myFeatureRoutes, // ✅ Add here
];
```

### Step 4: Create Page

```typescript
// pages/my-feature/index.tsx
import type { FC } from "react";
import { MyFeatureComponent } from "@/features/my-feature";

export const MyFeaturePage: FC = () => {
  return <MyFeatureComponent />;
};
```

Done! Route is now active. ✅

## Route Types

```typescript
// app/routing/types.ts
export interface AppRoute {
  path: string;
  element: React.ReactElement;
  guards?: Guard[];
}

export type Guard = "public" | "guest" | "auth" | { role: string };
```

## Benefits of This Pattern

### For Developers

1. **Feature ownership** - Routes defined alongside features
2. **No scattered guard logic** - Centralized in GuardResolver
3. **Type safety** - Route definitions are typed
4. **Easy to add routes** - Just export from feature and register
5. **Layout reuse** - No duplicated auth/layout code

### For Maintainability

1. **Declarative** - Routes as data, not imperative code
2. **Testable** - Guard logic in one place
3. **Scalable** - Easy to add features without touching core
4. **Clear** - Route list shows entire app structure

## Testing Routes and Guards

### Unit Tests - Guard Logic

Test `GuardResolver` directly:

```typescript
// app/routing/GuardResolver.test.tsx
import { render } from "@/test/utils/render-with-providers";
import { GuardResolver } from "./GuardResolver";

describe("GuardResolver", () => {
  it("redirects unauthenticated users from auth-guarded routes", () => {
    const { navigate } = render(
      <GuardResolver guards={["auth"]}>
        <div>Protected Content</div>
      </GuardResolver>,
      { preloadedState: { auth: { session: null } } }
    );

    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
```

### Integration Tests - Route Rendering

Test feature routes with guards:

```typescript
// features/dashboard/tests/dashboard-route.test.tsx
it("renders dashboard when authenticated", () => {
  const { getByText } = renderWithProviders(<DashboardPage />, {
    preloadedState: {
      auth: { session: mockAdminSession },
    },
  });

  expect(getByText("Welcome to Dashboard")).toBeInTheDocument();
});
```

### E2E Tests - Full Flows

Test navigation flows with Playwright:

```typescript
// e2e/auth-flow.spec.ts
test("redirects unauthenticated user from dashboard to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
```

## Troubleshooting

### Route Not Found

1. Check route is registered in `app/routing/routes.tsx`
2. Verify path spelling is correct
3. Ensure feature exports routes in `index.ts`

### Redirect Loop

1. Check guard conditions in `GuardResolver`
2. Verify session state is correctly set
3. Ensure guest guard is only on login page

### Layout Not Applied

1. Verify layout is wrapped in route definition:
   ```typescript
   element: <PrivateLayout><MyPage /></PrivateLayout>
   ```
2. Don't wrap layout in page file

## Related Documentation

- **[Folder Structure](./folder-structure.md)** - Where to place route files
- **[Architecture Overview](./overview.md)** - System design
- **[Adding Features](../guides/adding-features.md)** - Complete workflow
- **[Auth Flow](../features/auth-flow.md)** - Authentication details

## Summary

The routing system provides:

- ✅ **Feature ownership** - Routes defined per feature
- ✅ **Centralized guards** - No duplicated auth logic
- ✅ **Layout reuse** - PublicLayout/PrivateLayout
- ✅ **Type safety** - Fully typed route definitions
- ✅ **Testability** - Guard logic in one place
- ✅ **Scalability** - Easy to add routes without touching core
