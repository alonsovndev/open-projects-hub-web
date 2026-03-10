# Frontend Architecture

## Folder Structure

The project follows a modular, feature-driven folder structure designed to promote scalability and maintainability:

```
/src
  /app         # Application root setup (App.tsx, store providers, routing root)
  /features    # Feature-specific modules (follows strict feature module pattern)
  /pages       # Route-specific layout wrappers and page entry points
  /shared      # Global code shared across features (components, hooks, utils, types)
  /store       # Global Redux store setup (`configureStore`)
```

## Feature Module Pattern

Each feature is self-contained. The feature module structure typically includes:

```
/features/<FeatureName>
  /api         # RTK Query API slice (`<featureName>Api.ts`) and mock data (`mockData.ts`)
  /components  # Isolated feature components
    /<ComponentName>
      ComponentName.tsx
      ComponentName.module.scss
      index.ts
  /hooks       # Feature-specific hooks
  /types       # TypeScript interfaces for the feature
```

Example: `features/home`

```
/features/home
  /api
    homeApi.ts
    mockData.ts
  /components
    /HeroSection
      HeroSection.tsx
      HeroSection.module.scss
      index.ts
  /types
    index.ts
```

## Flow: UI → RTK Query Hook → API Slice → Backend (or Mock)

The data flow is structured to ensure separation of concerns and reduce prop-drilling:

1. **UI (React components)**: Consumes auto-generated hooks from the RTK Query API Slice.
2. **RTK Query Hook**: Handles caching, loading (`isLoading`), and error states automatically.
3. **API Slice**: Defines endpoints (`createApi`) using `fetchBaseQuery()` (or `fakeBaseQuery()` for mock APIs).
4. **Backend/Mock Layer**: The endpoint resolves the request, and the UI immediately updates based on cache logic.

This ensures maintainability and testability by completely decoupling UI and backend logic while enabling granular component-level fetching.

## Routing Separation

Routing is divided into public and admin routes to ensure proper access control. `src/pages` acts as the orchestrator.

- **Public Routes**:
  Defined under `src/routes/PublicRoutes`.

- **Admin Routes**:
  Defined under `src/routes/AdminRoutes`.
  - Validate JWT token for authentication.
  - Check for `admin` role before granting access.

## JWT Authentication Model

The authentication model is based on JWT tokens:

- Token is stored securely (e.g., `HttpOnly` cookies or memory).
- Middleware validates the JWT on every request.
- Decoded token contains user roles and permissions.

## Admin Role Validation

- Admin routes validate user roles before rendering components.
- Use a higher-order component (HOC) or custom hook like `useRoleValidation()` to manage role-based access.

## Forbidden Patterns

1. **Prop-Drilling Large Data Objects**:
   - Do not fetch all data at the Page level and pass it down manually. Always delegate data fetching to RTK Query and use **Component-Level Fetching**.

2. **Standard CSS or Inline Styles**:
   - Use SCSS Modules (`.module.scss`) for isolation. Avoid `style={{...}}` unless calculating dynamic layout dimensions.

3. **Axios / Thunks for standard fetching**:
   - Always use **RTK Query** (`createApi`) for caching and data fetching instead of manual Axios wrappers or Redux Thunks.

4. **Logic inside Pages**:
   - `src/pages` should only contain high-level structural layouts. All business logic and feature UI must reside inside `src/features/`.
