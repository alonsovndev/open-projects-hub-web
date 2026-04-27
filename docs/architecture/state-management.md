# State Management

Redux Toolkit + RTK Query patterns for client and server state.

## Overview

State is split by responsibility:

- **Redux slices** - Client-side UI and session state
- **RTK Query** - Server state, caching, and API integration

## Architecture

```text
src/app/api/base-api.ts       # RTK Query base config
src/app/store/store.ts         # Redux store setup
src/app/store/hooks.ts         # Typed hooks
src/features/<feature>/state/  # Feature Redux slices
src/features/<feature>/api/    # Feature RTK Query endpoints
```

## Client State (Redux Toolkit)

### When to Use

Use Redux slices for:

- Authentication session
- UI preferences
- Cross-page temporary state
- Multi-step wizard state

### Example: Auth Slice

```typescript
// features/auth/state/auth-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminSession } from "../types";

interface AuthState {
  session: AdminSession | null;
}

const initialState: AuthState = {
  session: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminSession: (state, action: PayloadAction<AdminSession>) => {
      state.session = action.payload;
    },
    clearAdminSession: (state) => {
      state.session = null;
    },
  },
});

export const { setAdminSession, clearAdminSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

### Registering in Store

```typescript
// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/app/api/base-api";
import { authReducer } from "@/features/auth/state/auth-slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// app/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Using in Components

```typescript
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setAdminSession, clearAdminSession } from "@/features/auth";

const MyComponent: FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);

  const handleLogin = (session: AdminSession) => {
    dispatch(setAdminSession(session));
  };

  const handleLogout = () => {
    dispatch(clearAdminSession());
  };

  return <div>{session?.displayName ?? "Guest"}</div>;
};
```

## Server State (RTK Query)

### When to Use

Use RTK Query for:

- Fetching data from APIs
- Caching server responses
- Loading and error state management
- Mutations (create, update, delete)
- Automatic refetching and invalidation

### Base API Setup

```typescript
// app/api/base-api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_CONFIG } from "@/resources/config/auth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      // Add auth token from localStorage
      const storedSession = localStorage.getItem(AUTH_CONFIG.storageKey);
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session.token) {
            headers.set("Authorization", `Bearer ${session.token}`);
          }
        } catch {
          localStorage.removeItem(AUTH_CONFIG.storageKey);
        }
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
```

### Feature API Endpoints

```typescript
// features/auth/api/auth-api.ts
import { baseApi } from "@/app/api/base-api";
import type { LoginValues, AdminSession, AuthResponse } from "../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AdminSession, LoginValues>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse): AdminSession => {
        // Normalize backend response
        return {
          token: response.token,
          email: response.email,
          displayName: response.display_name || response.email,
          loginTimestamp: Date.now(),
          role: response.role || "admin",
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
```

### Using Queries

```typescript
// Query example
const { data, isLoading, error } = useGetProjectsQuery();

if (isLoading) return <Spin />;
if (error) return <Alert message="Error loading projects" type="error" />;
return <ProjectList projects={data} />;
```

### Using Mutations

```typescript
// Mutation example
const [login, { isLoading, error }] = useLoginMutation();

const handleSubmit = async (values: LoginValues) => {
  try {
    const session = await login(values).unwrap();
    dispatch(setAdminSession(session));
    navigate("/dashboard");
  } catch (err) {
    console.error("Login failed:", err);
  }
};
```

## State Management Decision Tree

```
What kind of state do I need?

├─ Server data (from API)?
│  └─ Use RTK Query
│     ├─ Query for GET requests
│     └─ Mutation for POST/PUT/DELETE
│
├─ Client state (UI, session)?
│  └─ Shared across features?
│     ├─ YES → Redux slice
│     └─ NO  → Local component state (useState)
│
└─ Form state?
   └─ Simple form → Ant Design Form
   └─ Complex form → React Hook Form or local state
```

## Best Practices

### Do ✅

```typescript
// ✅ Use RTK Query for server data
const { data } = useGetUsersQuery();

// ✅ Use Redux slice for session
const session = useAppSelector((state) => state.auth.session);

// ✅ Use local state for UI-only state
const [isOpen, setIsOpen] = useState(false);

// ✅ Normalize API responses
transformResponse: (response: ApiUser): User => ({
  id: response.user_id,
  name: response.full_name,
});

// ✅ Use typed hooks
const dispatch = useAppDispatch();
const session = useAppSelector((state) => state.auth.session);
```

### Don't ❌

```typescript
// ❌ Don't use createAsyncThunk for routine fetching
const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const response = await fetch("/api/users");
  return response.json();
});

// ❌ Don't fetch in components manually
useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then(setUsers);
}, []);

// ❌ Don't put everything in Redux
const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Local is fine
const isMenuOpen = useAppSelector((state) => state.ui.isMenuOpen); // ❌ Overkill

// ❌ Don't use plain useDispatch/useSelector
const dispatch = useDispatch(); // Not typed
const dispatch = useAppDispatch(); // ✅ Typed
```

## Testing State

### Testing Redux Slices

```typescript
// features/auth/tests/auth-slice.test.ts
import { authReducer, setAdminSession, clearAdminSession } from "../state/auth-slice";

describe("authSlice", () => {
  it("should set admin session", () => {
    const session = { token: "abc", email: "admin@example.com" };
    const state = authReducer(undefined, setAdminSession(session));
    expect(state.session).toEqual(session);
  });

  it("should clear admin session", () => {
    const initialState = { session: { token: "abc" } };
    const state = authReducer(initialState, clearAdminSession());
    expect(state.session).toBeNull();
  });
});
```

### Testing RTK Query Hooks

```typescript
// features/auth/tests/login.test.tsx
import { renderWithProviders } from "@/test/utils/render-with-providers";
import { LoginForm } from "../components/login-form";
import { server } from "@/test/mocks/server";
import { rest } from "msw";

it("handles successful login", async () => {
  server.use(
    rest.post("/api/auth/login", (req, res, ctx) => {
      return res(ctx.json({ token: "abc123", email: "admin@test.com" }));
    })
  );

  const { getByLabelText, getByRole } = renderWithProviders(<LoginForm />);

  await userEvent.type(getByLabelText("Email"), "admin@test.com");
  await userEvent.type(getByLabelText("Password"), "password123");
  await userEvent.click(getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
```

## Troubleshooting

### Store Not Accessible

Ensure `Provider` wraps the app:

```typescript
// main.tsx
import { Provider } from "react-redux";
import { store } from "@/app/store/store";

<Provider store={store}>
  <App />
</Provider>
```

### API Requests Not Authenticated

Check `prepareHeaders` in base API includes token.

### State Not Persisting

Redux state is memory-only. Use `localStorage` for persistence:

```typescript
// Save to localStorage
localStorage.setItem("session", JSON.stringify(session));

// Load from localStorage
const storedSession = localStorage.getItem("session");
if (storedSession) {
  dispatch(setAdminSession(JSON.parse(storedSession)));
}
```

## Related Documentation

- **[Folder Structure](./folder-structure.md)** - Where to place state files
- **[Auth Flow](../features/auth-flow.md)** - Session management example
- **[Testing](../development/testing.md)** - Testing state
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - Official docs
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** - Official docs

## Summary

- ✅ Use **RTK Query** for server data
- ✅ Use **Redux slices** for shared client state
- ✅ Use **local state** for component-only UI
- ✅ Always use typed hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Normalize API responses in RTK Query
- ✅ Keep API endpoints in feature folders
