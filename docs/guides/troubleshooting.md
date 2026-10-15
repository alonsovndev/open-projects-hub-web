# Troubleshooting

Common issues and solutions for Open Projects Hub Web development.

## Build Issues

### Build Fails with Missing Module

**Error**:

```
Could not find module '@/features/my-feature'
```

**Solutions**:

1. **Check feature exports public API**:

   ```typescript
   // features/my-feature/index.ts should exist and export
   export { MyComponent } from "./components/MyComponent";
   ```

2. **Verify import path uses absolute imports**:

   ```typescript
   // ✅ Correct
   import { MyComponent } from "@/features/my-feature";

   // ❌ Wrong
   import { MyComponent } from "../../../features/my-feature";
   ```

3. **Check TypeScript path aliases**:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

### Build Fails with Missing SCSS File

**Error**:

```
Could not find stylesheet: './home.module.scss'
```

**Solutions**:

1. **Create the missing file**:

   ```bash
   touch src/pages/home/home.module.scss
   ```

2. **Or remove the import** if styles not needed:
   ```typescript
   // Remove this line:
   import styles from "./home.module.scss";
   ```

### Type Errors in Build

**Error**:

```
Type 'unknown' is not assignable to type 'Session'
```

**Solutions**:

1. **Add type assertions**:

   ```typescript
   const session = localStorage.getItem("session") as string | null;
   const parsed = session ? (JSON.parse(session) as Session) : null;
   ```

2. **Use type guards**:
   ```typescript
   function isSession(value: unknown): value is Session {
     return typeof value === "object" && value !== null && "token" in value;
   }
   ```

## Routing Issues

### Route Not Found (404)

**Problem**: Visiting `/my-feature` shows 404 or redirects incorrectly

**Solutions**:

1. **Check route is registered**:

   ```typescript
   // app/routing/routes.tsx
   import { myFeatureRoutes } from "@/features/my-feature";

   export const appRoutes: AppRoute[] = [
     ...homeRoutes,
     ...myFeatureRoutes, // ✅ Must be here
   ];
   ```

2. **Verify feature exports routes**:

   ```typescript
   // features/my-feature/index.ts
   export { myFeatureRoutes } from "./routes";
   ```

3. **Check path spelling**:
   ```typescript
   // routes.tsx
   {
     path: "/my-feature";
   } // Must match URL exactly
   ```

### Redirect Loop

**Problem**: Page keeps redirecting endlessly

**Solutions**:

1. **Check guard logic**:

   ```typescript
   // Don't use "guest" guard on protected pages
   // ❌ Wrong
   { path: "/dashboard", guards: ["guest"] }

   // ✅ Correct
   { path: "/dashboard", guards: ["auth"] }
   ```

2. **Verify session state**:

   ```typescript
   const session = useAppSelector((state) => state.auth.session);
   console.log("Current session:", session); // Debug session state
   ```

3. **Check GuardResolver logic**:
   ```typescript
   // Ensure guards don't conflict
   guards: ["auth", "guest"]; // ❌ Contradictory
   guards: ["auth"]; // ✅ Correct
   ```

### Layout Not Applied

**Problem**: Page doesn't show expected header/footer

**Solutions**:

1. **Wrap page in layout in route definition**:

   ```typescript
   // ✅ Correct - in routes.tsx
   element: <AdminLayout><DashboardPage /></AdminLayout>

   // ❌ Wrong - in page file
   export const DashboardPage = () => (
     <AdminLayout>...</AdminLayout>
   );
   ```

2. **Check layout import**:
   ```typescript
   import { AdminLayout } from "@/app/layouts"; // ✅ Correct path
   ```

## State Management Issues

### Redux State Not Updating

**Problem**: Dispatching actions but state doesn't change

**Solutions**:

1. **Check reducer is registered**:

   ```typescript
   // app/store/store.ts
   export const store = configureStore({
     reducer: {
       auth: authReducer, // ✅ Must be registered
     },
   });
   ```

2. **Use typed hooks**:

   ```typescript
   // ✅ Correct
   const dispatch = useAppDispatch();

   // ❌ Wrong - not typed
   const dispatch = useDispatch();
   ```

3. **Check action is dispatched**:
   ```typescript
   dispatch(setSession(session)); // Add console.log to verify
   console.log("Dispatched setSession:", session);
   ```

### RTK Query Not Fetching

**Problem**: `useGetDataQuery()` doesn't fetch data

**Solutions**:

1. **Check base API is configured**:

   ```typescript
   // app/api/base-api.ts
   export const baseApi = createApi({
     baseQuery: fetchBaseQuery({ baseUrl: "..." }),
     endpoints: () => ({}),
   });
   ```

2. **Verify endpoint is injected**:

   ```typescript
   // features/my-feature/api/my-api.ts
   export const myApi = baseApi.injectEndpoints({  // ✅ Must inject
     endpoints: (builder) => ({
       getData: builder.query({...}),
     }),
   });
   ```

3. **Check API middleware is added**:
   ```typescript
   // app/store/store.ts
   middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware().concat(baseApi.middleware),  // ✅ Required
   ```

### API Requests Not Authenticated

**Problem**: API returns 401 Unauthorized

**Solutions**:

1. **Check prepareHeaders in base API**:

   ```typescript
   // app/api/base-api.ts
   baseQuery: fetchBaseQuery({
     prepareHeaders: (headers) => {
       const token = getToken();  // Get from storage
       if (token) {
         headers.set("Authorization", `Bearer ${token}`);
       }
       return headers;
     },
   }),
   ```

2. **Verify token is saved**:
   ```typescript
   localStorage.setItem("session", JSON.stringify({ token: "..." }));
   console.log(localStorage.getItem("session")); // Debug
   ```

## Component Issues

### Component Not Found

**Error**:

```
Cannot find module './MyComponent'
```

**Solutions**:

1. **Check barrel export exists**:

   ```typescript
   // features/my-feature/components/my-component/index.ts
   export { MyComponent } from "./MyComponent";
   ```

2. **Use feature public API**:

   ```typescript
   // ✅ Correct
   import { MyComponent } from "@/features/my-feature";

   // ❌ Wrong - deep import
   import { MyComponent } from "@/features/my-feature/components/MyComponent";
   ```

### Styles Not Applied

**Problem**: Component renders but styles don't apply

**Solutions**:

1. **Check import path**:

   ```typescript
   import styles from "./my-component.module.scss"; // ✅ .module.scss
   ```

2. **Use className correctly**:

   ```typescript
   <div className={styles.container}>  // ✅ Correct
   <div className="container">  // ❌ Wrong (not scoped)
   ```

3. **Verify SCSS Module syntax**:
   ```scss
   // my-component.module.scss
   .container {
     // ✅ Use class selector
     padding: 24px;
   }
   ```

### Props Type Errors

**Error**:

```
Property 'onSubmit' does not exist on type 'IntrinsicAttributes'
```

**Solutions**:

1. **Define component props interface**:

   ```typescript
   interface MyComponentProps {
     onSubmit: (values: FormValues) => void;
   }

   export const MyComponent: FC<MyComponentProps> = ({ onSubmit }) => {
     // ...
   };
   ```

2. **Use correct generic syntax**:
   ```typescript
   const MyComponent: FC<MyComponentProps> = (props) => {}; // ✅ Correct
   const MyComponent = (props) => {}; // ❌ Not typed
   ```

## Testing Issues

### Tests Fail with Provider Errors

**Error**:

```
Could not find react-redux context value
```

**Solutions**:

1. **Use render-with-providers**:

   ```typescript
   // ✅ Correct
   import { render } from "@/test/utils/render-with-providers";
   render(<MyComponent />);

   // ❌ Wrong - missing Redux/Router context
   import { render } from "@testing-library/react";
   render(<MyComponent />);
   ```

2. **Provide preloaded state**:
   ```typescript
   render(<MyComponent />, {
     preloadedState: {
       auth: { session: mockSession },
     },
   });
   ```

### Tests Fail with API Errors

**Error**:

```
Network request failed
```

**Solutions**:

1. **Mock API handlers**:

   ```typescript
   import { server } from "@/test/mocks/server";
   import { rest } from "msw";

   server.use(
     rest.get("/api/projects", (req, res, ctx) => {
       return res(ctx.json({ projects: [] }));
     })
   );
   ```

2. **Use RTK Query test helpers**:

   ```typescript
   import { renderHook, waitFor } from "@testing-library/react";
   import { wrapper } from "@/test/utils/render-with-providers";

   const { result } = renderHook(() => useGetProjectsQuery(), { wrapper });
   await waitFor(() => expect(result.current.isSuccess).toBe(true));
   ```

## Git and Commit Issues

### Commit Fails with Formatting Errors

**Error**:

```
husky - pre-commit hook failed (code 1)
```

**Solutions**:

1. **Run format before commit**:

   ```bash
   npm run format
   git add .
   git commit -m "fix: resolve formatting"
   ```

2. **Check formatting issues**:
   ```bash
   npm run format:check
   ```

### Commit Message Rejected

**Error**:

```
commit message does not follow conventional commits
```

**Solutions**:

1. **Use correct format**:

   ```bash
   # ✅ Correct
   git commit -m "feat: add project list page"
   git commit -m "fix: resolve login redirect"

   # ❌ Wrong
   git commit -m "added feature"
   git commit -m "WIP"
   ```

2. **Valid types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

## Performance Issues

### Slow Development Server

**Solutions**:

1. **Clear node_modules and reinstall**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check for large dependencies**:

   ```bash
   npx bundle-size
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Slow Build Times

**Solutions**:

1. **Check for unused imports**:

   ```bash
   npx unimported
   ```

2. **Use production build**:

   ```bash
   npm run build
   ```

3. **Analyze bundle size**:
   ```bash
   npm run build -- --analyze
   ```

## Common Gotchas

### 1. Feature Not Exported

```typescript
// ❌ Wrong - component not exported
// features/auth/index.ts
export { authRoutes } from "./routes";
// Missing: export { LoginForm } from "./components/login-form";

// ✅ Correct
export { authRoutes } from "./routes";
export { LoginForm } from "./components/login-form";
```

### 2. Deep Imports

```typescript
// ❌ Wrong - breaks encapsulation
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";

// ✅ Correct - use public API
import { LoginForm } from "@/features/auth";
```

### 3. Missing Barrel Export

```typescript
// ❌ Wrong - no index.ts
features / auth / components / login - form / LoginForm.tsx;
login - form.module.scss;

// ✅ Correct - includes index.ts
features / auth / components / login - form / LoginForm.tsx;
login - form.module.scss;
index.ts; // export { LoginForm } from "./LoginForm";
```

### 4. Layout in Wrong Place

```typescript
// ❌ Wrong - layout in page file
export const DashboardPage = () => (
  <AdminLayout>
    <DashboardContent />
  </AdminLayout>
);

// ✅ Correct - layout in routes.tsx
{
  path: "/dashboard",
  element: <AdminLayout><DashboardPage /></AdminLayout>,
}
```

## Getting More Help

### Debug Checklist

Before asking for help, verify:

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] `npm run format:check` passes
- [ ] Feature exports public API
- [ ] Routes are registered
- [ ] Redux reducer is registered (if using Redux)
- [ ] API middleware is configured (if using RTK Query)
- [ ] Tests pass (`npm run test:run`)

### Useful Debug Commands

```bash
# Check TypeScript issues
npm run type-check

# Check build issues
npm run build

# Check formatting
npm run format:check

# Run all checks
npm run verify

# Check dependencies
npm list <package-name>

# Clear caches
rm -rf node_modules package-lock.json .vite
npm install
```

## Related Documentation

- **[Getting Started](../getting-started.md)** - Setup and basics
- **[Adding Features](./adding-features.md)** - Feature workflow
- **[Conventions](../development/conventions.md)** - Naming and organization
- **[Testing](../development/testing.md)** - Testing issues
- **[Architecture Overview](../architecture/overview.md)** - System design

## Report an Issue

If you encounter a new issue not covered here:

1. Capture the full error message
2. Note the steps to reproduce
3. Check if it happens in a fresh clone
4. Document the workaround if found
5. Update this troubleshooting guide
