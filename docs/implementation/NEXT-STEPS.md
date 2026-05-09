# Next Steps - Frontend Improvement Roadmap

**Last updated:** April 30, 2026  
**Status:** Phase 1 & 2 Complete (15/16 tasks) | Phase 3 In Progress

---

## Quick Reference

| Priority      | Tasks   | Effort | Status                   | Owner              |
| ------------- | ------- | ------ | ------------------------ | ------------------ |
| **Immediate** | 3 tasks | 10-12h | 🟢 Ready                 | Frontend           |
| **Medium**    | 4 tasks | 16-20h | 🟡 Waiting on backend    | Frontend + Backend |
| **Critical**  | 1 task  | 10h    | 🔴 Requires coordination | Backend + Frontend |
| **Low**       | 3 tasks | 6-9h   | ⚪ Post-launch           | Frontend           |

---

## 🟢 Immediate Priority (Ready to Start)

**Goal:** Complete remaining Phase 3 improvements  
**Estimated effort:** 10-12 hours  
**Prerequisites:** None - ready to start  
**Owner:** Frontend team

---

### 1. Add Loading Skeletons

**Effort:** 2-3 hours  
**Priority:** HIGH  
**Status:** 🟢 Ready

#### Why

- Current loading uses generic Spin component
- Skeletons provide better perceived performance
- Users see layout structure while data loads
- Industry best practice (GitHub, LinkedIn, Facebook all use skeletons)

#### What to Build

**Create skeleton components:**

```tsx
// src/shared/components/skeletons/TableSkeleton.tsx
// - Skeleton for ProjectsTable
// - Props: rows (default 5), columns (default 6)
// - Use Ant Design <Skeleton> with table layout

// src/shared/components/skeletons/CardSkeleton.tsx
// - Skeleton for ProjectList cards
// - Props: count (default 6), layout ('grid' | 'list')
// - Use Ant Design <Skeleton.Button> for actions

// src/shared/components/skeletons/BoardSkeleton.tsx
// - Skeleton for BacklogBoard columns
// - Props: columns (default 4), cardsPerColumn (default 3)
// - Use Ant Design <Skeleton> with custom styles
```

**Update components to use skeletons:**

```tsx
// ProjectsTable.tsx
{
  isLoading ? <TableSkeleton rows={10} /> : <Table dataSource={data} />;
}

// ProjectList.tsx
{
  isLoading ? <CardSkeleton count={6} layout="grid" /> : <Row>{cards}</Row>;
}

// BacklogBoard.tsx
{
  isLoading ? <BoardSkeleton columns={4} /> : <DndContext>{board}</DndContext>;
}
```

#### Acceptance Criteria

- ✅ 3 skeleton components created (Table, Card, Board)
- ✅ Components use Ant Design Skeleton API
- ✅ Skeletons match actual component layout
- ✅ Props allow customization (rows, count, columns)
- ✅ All loading states replaced with skeletons

#### Files to Modify

- `src/shared/components/skeletons/TableSkeleton.tsx` (new)
- `src/shared/components/skeletons/CardSkeleton.tsx` (new)
- `src/shared/components/skeletons/BoardSkeleton.tsx` (new)
- `src/features/projects/components/ProjectsTable.tsx` (update)
- `src/features/projects/components/ProjectList.tsx` (update)
- `src/features/backlog/components/BacklogBoard.tsx` (update)

#### Verification

```bash
npm run dev
# Navigate to Projects page → see table skeleton while loading
# Navigate to Dashboard → see card skeleton while loading
# Navigate to Backlog → see board skeleton while loading
```

---

### 2. Convert Remaining Hooks to RTK Query

**Effort:** 4-6 hours  
**Priority:** HIGH  
**Status:** 🟢 Ready

#### Why

- RTK Query APIs already created (projects, stories, settings)
- Hooks still use mock useState/useEffect pattern
- Eliminates duplicate loading/error state management
- Automatic caching and request deduplication
- Consistent error handling

#### What to Update

**Hook: `use-backlog.ts`**

```tsx
// BEFORE (mock pattern)
const useBacklog = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  // ...fetch logic
};

// AFTER (RTK Query)
const useBacklog = () => {
  const { data, isLoading, error } = useGetBacklogStoriesQuery();
  // ...derived state
};
```

**Hook: `use-projects-overview.ts`**

```tsx
// BEFORE
const useProjectsOverview = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  // ...fetch logic
};

// AFTER
const useProjectsOverview = () => {
  const { data, isLoading, error } = useGetProjectsQuery();
  // ...derived state
};
```

**Hook: Settings hooks**

```tsx
// Migrate:
// - use-profile.ts → useGetUserProfileQuery
// - use-preferences.ts → useGetUserPreferencesQuery
// - use-password-change.ts → useChangePasswordMutation
```

#### Acceptance Criteria

- ✅ `use-backlog.ts` uses `storiesApi`
- ✅ `use-projects-overview.ts` uses `projectsApi`
- ✅ Settings hooks use `settingsApi`
- ✅ Mock useState/useEffect patterns removed
- ✅ Loading/error states come from RTK Query
- ✅ No breaking changes to components using hooks
- ✅ Build passes with no TypeScript errors

#### Files to Modify

- `src/features/backlog/hooks/use-backlog.ts`
- `src/features/projects/hooks/use-projects-overview.ts`
- `src/features/settings/hooks/use-profile.ts`
- `src/features/settings/hooks/use-preferences.ts`
- `src/features/settings/hooks/use-password-change.ts`

#### Verification

```bash
npm run type-check
npm run build
npm run dev
# Test Projects, Backlog, Settings pages
# Verify loading states work
# Verify data displays correctly
# Check Redux DevTools for RTK Query cache
```

---

### 3. Add Error Tracking Integration

**Effort:** 1-2 hours  
**Priority:** HIGH  
**Status:** 🟢 Ready

#### Why

- Production error monitoring is essential
- Need visibility into user-facing errors
- Helps prioritize bug fixes
- Provides context (user, browser, actions before error)

#### What to Build

**Install Sentry:**

```bash
npm install @sentry/react
```

**Configure Sentry:**

```tsx
// src/config/sentry.ts (new)
import * as Sentry from "@sentry/react";
import { env } from "./env";

if (env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.VITE_ENV || "development",
    enabled: env.VITE_ENV === "production",
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of errors
  });
}
```

**Update ErrorBoundary:**

```tsx
// ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error("Error caught by boundary:", error, errorInfo);
  Sentry.captureException(error, { contexts: { react: errorInfo } });
}
```

**Update error-handler.ts:**

```tsx
// error-handler.ts
export function handleApiError(error: unknown) {
  const message = getErrorMessage(error);

  // Log to Sentry
  Sentry.captureException(error, {
    tags: { type: "api_error" },
    extra: { errorMessage: message },
  });

  // Show user-friendly message
  message.error(message);
}
```

**Update env.ts:**

```tsx
// env.ts - add optional Sentry DSN
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().min(1),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ENV: z.enum(["development", "staging", "production"]).optional(),
});
```

#### Acceptance Criteria

- ✅ Sentry installed and configured
- ✅ ErrorBoundary reports to Sentry
- ✅ API errors report to Sentry
- ✅ Source maps configured for production
- ✅ Only enabled in production environment
- ✅ Sentry DSN in environment variables (not committed)

#### Files to Create/Modify

- `src/config/sentry.ts` (new)
- `src/config/env.ts` (update - add VITE_SENTRY_DSN)
- `src/shared/components/ErrorBoundary.tsx` (update)
- `src/shared/utils/error-handler.ts` (update)
- `src/main.tsx` (import sentry config)
- `.env.example` (add VITE_SENTRY_DSN)
- `vite.config.mts` (configure source maps)

#### Verification

```bash
# Add to .env.local (get DSN from Sentry dashboard)
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_ENV=development

npm run dev
# Trigger an error (throw new Error in component)
# Check Sentry dashboard for error report
# Verify source maps show correct line numbers
```

---

## 🟡 Medium Priority (Waiting on Backend)

**Goal:** Complete API integration and performance optimization  
**Estimated effort:** 16-20 hours  
**Prerequisites:** Backend API endpoints implemented  
**Owner:** Frontend + Backend teams

---

### 4. Backend API Implementation

**Effort:** Varies by endpoint (backend team)  
**Priority:** HIGH  
**Status:** 🟡 Blocked - Backend team  
**Owner:** Backend team

#### Why

- Frontend RTK Query APIs ready but calling mocks
- Need real endpoints for production
- Contract documented in `docs/api/integration-guide.md`

#### What to Implement

**Required endpoints:**

**Projects API:**

- `GET /api/v1/projects` - List projects with pagination/filters
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `GET /api/v1/dashboard/stats` - Dashboard statistics

**Stories API:**

- `GET /api/v1/stories` - List stories with pagination/filters
- `POST /api/v1/stories` - Create story
- `GET /api/v1/stories/:id` - Get story details
- `PATCH /api/v1/stories/:id` - Update story (includes status changes)
- `DELETE /api/v1/stories/:id` - Delete story
- `GET /api/v1/stories/backlog` - Get backlog board view
- `POST /api/v1/stories/export` - Export stories (CSV/Excel)

**Settings API:**

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `POST /api/v1/users/me/change-password` - Change password
- `GET /api/v1/users/me/preferences` - Get user preferences
- `PUT /api/v1/users/me/preferences` - Update user preferences
- `POST /api/v1/users/me/avatar` - Upload avatar (multipart/form-data)

#### Acceptance Criteria

- ✅ All endpoints from `docs/api/integration-guide.md` implemented
- ✅ Request/response schemas match documented contract
- ✅ Error responses use standard format (status + message)
- ✅ Authentication with JWT (Authorization: Bearer <token>)
- ✅ Pagination uses `page`, `limit`, `total`, `totalPages`
- ✅ Tested with Postman/Insomnia
- ✅ Deployed to staging environment
- ✅ API documentation (OpenAPI/Swagger) generated

#### Documentation Reference

See `docs/api/integration-guide.md` for:

- Complete endpoint specifications
- Request/response schemas
- Error handling format
- Authentication flow
- Pagination format
- Filter query parameters

---

### 5. Frontend API Integration

**Effort:** 4-6 hours  
**Priority:** HIGH  
**Status:** 🟡 Blocked - Waiting on task #4  
**Owner:** Frontend team

#### Why

- Remove mock data dependencies
- Connect to real backend API
- Integration testing with actual data
- Validate error scenarios work

#### What to Do

**Update base API URL:**

```tsx
// src/app/api/base-api.ts
baseQuery: fetchBaseQuery({
  baseUrl: env.VITE_API_BASE_URL, // Points to staging API
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token"); // TODO: Move to httpOnly cookies
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
}),
```

**Remove mock files:**

```bash
# Delete mock data (once API works)
rm -rf src/mocks/
```

**Test error scenarios:**

- 401 Unauthorized → redirect to login
- 403 Forbidden → show access denied message
- 404 Not Found → show not found message
- 500 Server Error → show retry message
- Network error → show offline message

**Update environment variables:**

```bash
# .env.staging
VITE_API_BASE_URL=https://staging-api.openprojectshub.com/api/v1
```

#### Acceptance Criteria

- ✅ Base API URL points to staging environment
- ✅ Mock data files deleted
- ✅ All features work with real API
- ✅ Error scenarios handled gracefully
- ✅ Loading states work correctly
- ✅ Cache invalidation works (create/update/delete)
- ✅ Optimistic updates work (drag-and-drop)
- ✅ Integration tests pass

#### Files to Modify

- `src/app/api/base-api.ts` (update baseUrl)
- `.env.staging` (add staging API URL)
- Delete `src/mocks/*` (once verified)

#### Verification

```bash
# Point to staging API
VITE_API_BASE_URL=https://staging-api.openprojectshub.com/api/v1 npm run dev

# Manual testing checklist:
# ✅ Login with real credentials
# ✅ Dashboard shows real stats
# ✅ Projects page loads real data
# ✅ Create/edit/delete project works
# ✅ Backlog board loads real stories
# ✅ Drag-and-drop updates story status
# ✅ Settings page loads user profile
# ✅ Error scenarios show correct messages
# ✅ Network errors handled gracefully
```

---

### 6. Virtualization for Long Lists

**Effort:** 3-4 hours  
**Priority:** MEDIUM  
**Status:** 🟡 Can start (not blocked)  
**Owner:** Frontend team

#### Why

- Performance degrades with 100+ items in DOM
- BacklogBoard with 200+ stories causes lag
- ProjectsTable with 500+ rows slows scrolling
- Virtualization renders only visible items
- **Performance improvement:** 50-90% faster rendering

#### What to Build

**Install virtualization library:**

```bash
npm install @tanstack/react-virtual
```

**Virtualize BacklogBoard:**

```tsx
// BacklogBoard.tsx
import { useVirtualizer } from "@tanstack/react-virtual";

const BacklogBoard = ({ stories }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: stories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Story card height
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <StoryCard
            key={virtualRow.index}
            story={stories[virtualRow.index]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

**Virtualize ProjectsTable:**

```tsx
// ProjectsTable.tsx - Use Ant Design Table virtual scroll
<Table
  dataSource={projects}
  columns={columns}
  scroll={{ y: 600 }} // Enable virtual scrolling
  virtual // Ant Design 6 built-in virtualization
  pagination={{
    pageSize: 100, // Larger page size with virtualization
  }}
/>
```

#### Acceptance Criteria

- ✅ @tanstack/react-virtual installed
- ✅ BacklogBoard virtualized when stories > 50
- ✅ ProjectsTable uses Ant Design virtual scroll
- ✅ Scrolling is smooth with 500+ items
- ✅ Memory usage improved (fewer DOM nodes)
- ✅ Drag-and-drop still works with virtualization
- ✅ Performance measured (before/after)

#### Performance Testing

```tsx
// Test script to generate large datasets
// src/utils/test-data-generator.ts
export const generateStories = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `story-${i}`,
    title: `Story ${i}`,
    status: statuses[i % 4],
    priority: priorities[i % 3],
    // ...
  }));
};

// In BacklogPage, toggle test mode:
const stories = useBacklog(); // Real data
// const stories = generateStories(500); // Test data
```

**Measure performance:**

```bash
# Open Chrome DevTools → Performance tab
# Record scrolling with 50 items → check FPS
# Record scrolling with 500 items (virtualized) → compare FPS
# Expected: 60 FPS maintained even with 500+ items
```

#### Files to Modify

- `src/features/backlog/components/BacklogBoard.tsx`
- `src/features/projects/components/ProjectsTable.tsx`
- `package.json` (add @tanstack/react-virtual)

---

### 7. Increase Test Coverage

**Effort:** 8-12 hours  
**Priority:** MEDIUM  
**Status:** 🟡 Can start (not blocked)  
**Owner:** Frontend team

#### Why

- Current coverage: ~30% (low)
- Target coverage: 70%+ (industry standard)
- RTK Query APIs not tested
- Error boundary not tested
- Lazy loading not tested
- Quality gate for production

#### What to Test

**RTK Query APIs (high value):**

```tsx
// projects-api.test.ts
describe("Projects API", () => {
  it("fetches projects list", async () => {
    const { result } = renderHook(() => useGetProjectsQuery());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(10);
  });

  it("creates project with optimistic update", async () => {
    const { result } = renderHook(() => useCreateProjectMutation());
    const [createProject] = result.current;
    await createProject({ name: "New Project" });
    // Verify cache updated
  });

  it("handles API errors gracefully", async () => {
    server.use(
      rest.get("/projects", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );
    const { result } = renderHook(() => useGetProjectsQuery());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

**Error Boundary:**

```tsx
// ErrorBoundary.test.tsx
describe("ErrorBoundary", () => {
  it("catches errors and shows fallback UI", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows error details in development", () => {
    process.env.NODE_ENV = "development";
    // ... render with error
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it("hides error details in production", () => {
    process.env.NODE_ENV = "production";
    // ... render with error
    expect(screen.queryByText(/Test error/i)).not.toBeInTheDocument();
  });
});
```

**Lazy Loading:**

```tsx
// lazy-loader.test.tsx
describe("lazyWithRetry", () => {
  it("loads component successfully", async () => {
    const Component = lazyWithRetry(() => import("./TestComponent"));
    render(
      <Suspense fallback="Loading">
        <Component />
      </Suspense>
    );
    await waitFor(() => expect(screen.getByText("Test")).toBeInTheDocument());
  });

  it("retries on chunk load failure", async () => {
    // Mock failed import, then succeed
    const importFn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Chunk load failed"))
      .mockResolvedValueOnce({ default: TestComponent });

    const Component = lazyWithRetry(importFn);
    render(
      <Suspense fallback="Loading">
        <Component />
      </Suspense>
    );

    await waitFor(() => expect(importFn).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

**Hooks with RTK Query:**

```tsx
// use-dashboard.test.ts
describe("useDashboard", () => {
  it("returns dashboard stats from API", async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.stats).toEqual({
      totalProjects: 10,
      activeProjects: 5,
      completedProjects: 5,
      totalStories: 50,
      completedStories: 30,
      teamMembers: 8,
    });
  });
});
```

#### Test Coverage Goals

| Area           | Current | Target | Priority |
| -------------- | ------- | ------ | -------- |
| RTK Query APIs | 0%      | 80%    | HIGH     |
| Error Boundary | 0%      | 90%    | HIGH     |
| Lazy Loading   | 0%      | 70%    | MEDIUM   |
| Hooks          | 40%     | 75%    | MEDIUM   |
| Components     | 50%     | 70%    | MEDIUM   |
| Utilities      | 60%     | 80%    | LOW      |

#### Acceptance Criteria

- ✅ Overall test coverage ≥ 70%
- ✅ All RTK Query APIs have tests (success + error cases)
- ✅ ErrorBoundary tests pass (dev + prod modes)
- ✅ Lazy loading tests pass (success + retry logic)
- ✅ Updated hooks tested (use-dashboard, use-backlog, etc.)
- ✅ CI pipeline shows coverage report
- ✅ Coverage uploaded to Codecov

#### Files to Create

- `src/features/projects/api/__tests__/projects-api.test.ts`
- `src/features/backlog/api/__tests__/stories-api.test.ts`
- `src/features/settings/api/__tests__/settings-api.test.ts`
- `src/shared/components/__tests__/ErrorBoundary.test.tsx`
- `src/app/routing/__tests__/lazy-loader.test.tsx`
- `src/features/dashboard/hooks/__tests__/use-dashboard.test.ts`

#### Verification

```bash
npm run test:unit -- --coverage
# Check coverage report in terminal
# Open coverage/index.html in browser
# Verify ≥ 70% coverage

npm run test:unit -- --watch
# Run tests in watch mode during development
```

---

## 🔴 Critical Priority (Requires Coordination)

**Goal:** Fix security vulnerability  
**Estimated effort:** 10 hours (8h backend + 2h frontend)  
**Prerequisites:** Backend team availability  
**Owner:** Backend + Frontend teams

---

### 8. JWT Security Fix

**Effort:** 8h backend + 2h frontend  
**Priority:** CRITICAL  
**Status:** 🔴 Blocked - Requires backend coordination  
**Security impact:** HIGH (4/10 → 8/10)

#### Why

- **Current risk:** JWT stored in localStorage (vulnerable to XSS)
- XSS attack can steal token → attacker gains full access
- Industry best practice: httpOnly cookies (not accessible to JavaScript)
- **Regulatory:** May be required for GDPR/SOC2 compliance

#### Security Comparison

| Storage         | XSS Risk | CSRF Risk | Best Practice                    |
| --------------- | -------- | --------- | -------------------------------- |
| localStorage    | ❌ HIGH  | ✅ Low    | ❌ Not recommended               |
| httpOnly cookie | ✅ Low   | ⚠️ Medium | ✅ Recommended + CSRF protection |

#### What to Implement

**Backend (8 hours):**

1. **Add cookie support to auth endpoints:**

```python
# auth.py (FastAPI)
from fastapi import Response
from datetime import timedelta

@router.post("/login")
def login(credentials: LoginRequest, response: Response):
    user = authenticate(credentials)
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    # Set httpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,        # Not accessible to JavaScript
        secure=True,          # Only HTTPS
        samesite="strict",    # CSRF protection
        max_age=15 * 60,      # 15 minutes
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return {"user": user.dict()}
```

2. **Add refresh token rotation:**

```python
@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    old_refresh_token = request.cookies.get("refresh_token")

    # Validate old token
    user_id = verify_refresh_token(old_refresh_token)

    # Issue new tokens
    new_access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)

    # Invalidate old refresh token (store in Redis/DB)
    revoke_refresh_token(old_refresh_token)

    # Set new cookies
    response.set_cookie("access_token", new_access_token, ...)
    response.set_cookie("refresh_token", new_refresh_token, ...)

    return {"success": True}
```

3. **Update authentication middleware:**

```python
# middleware.py
def get_current_user(request: Request):
    # Read token from cookie instead of Authorization header
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(401, "Not authenticated")

    user_id = verify_access_token(token)
    return get_user(user_id)
```

4. **Add logout endpoint:**

```python
@router.post("/logout")
def logout(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")

    # Revoke refresh token
    if refresh_token:
        revoke_refresh_token(refresh_token)

    # Clear cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"success": True}
```

**Frontend (2 hours):**

1. **Remove localStorage usage:**

```tsx
// auth-slice.ts - REMOVE
localStorage.setItem("token", token);
localStorage.getItem("token");
localStorage.removeItem("token");
```

2. **Update API base query:**

```tsx
// base-api.ts
baseQuery: fetchBaseQuery({
  baseUrl: env.VITE_API_BASE_URL,
  credentials: "include", // Send cookies with requests
  prepareHeaders: (headers) => {
    // No need to manually set Authorization header
    // Cookies sent automatically
    return headers;
  },
}),
```

3. **Add token refresh logic:**

```tsx
// base-api.ts
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If 401, try to refresh token
  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout
      api.dispatch(logout());
    }
  }

  return result;
};
```

4. **Update auth slice:**

```tsx
// auth-slice.ts
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    // Remove token from state
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // No token storage
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // No token removal needed
    },
  },
});
```

5. **Update login/logout flows:**

```tsx
// Login.tsx
const [login, { isLoading }] = useLoginMutation();

const handleSubmit = async (values) => {
  try {
    const { user } = await login(values).unwrap();
    dispatch(setCredentials({ user }));
    navigate("/dashboard");
  } catch (error) {
    message.error("Login failed");
  }
};

// Logout.tsx
const [logout] = useLogoutMutation();

const handleLogout = async () => {
  await logout().unwrap();
  dispatch(clearCredentials());
  navigate("/login");
};
```

#### Acceptance Criteria

**Backend:**

- ✅ Login sets httpOnly cookies (access_token + refresh_token)
- ✅ Cookies have secure flags (httpOnly, secure, samesite=strict)
- ✅ Refresh endpoint rotates tokens
- ✅ Old refresh tokens invalidated after use
- ✅ Logout clears cookies
- ✅ Middleware reads token from cookies
- ✅ CSRF protection enabled (samesite=strict)

**Frontend:**

- ✅ localStorage token usage removed
- ✅ Cookies sent automatically with `credentials: "include"`
- ✅ Token refresh logic works (401 → refresh → retry)
- ✅ Login flow works with cookies
- ✅ Logout clears cookies
- ✅ No breaking changes to existing features

**Security:**

- ✅ XSS cannot access tokens (httpOnly)
- ✅ CSRF protection enabled (samesite=strict)
- ✅ Tokens short-lived (access: 15min, refresh: 7 days)
- ✅ Refresh token rotation prevents reuse
- ✅ Security audit passed

#### Testing Checklist

**Backend tests:**

```bash
# Test login sets cookies
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -v | grep "Set-Cookie"

# Expected: 2 Set-Cookie headers (access_token, refresh_token)

# Test protected endpoint with cookies
curl -X GET http://localhost:8000/projects \
  --cookie "access_token=..." \
  -v

# Expected: 200 OK with projects data

# Test token refresh
curl -X POST http://localhost:8000/auth/refresh \
  --cookie "refresh_token=..." \
  -v | grep "Set-Cookie"

# Expected: 2 new Set-Cookie headers
```

**Frontend tests:**

```bash
npm run dev

# Manual testing:
# ✅ Login → DevTools Application tab → Cookies → see access_token
# ✅ Navigate to Projects → data loads (cookie sent automatically)
# ✅ Wait 15 min → token expires → auto-refresh works
# ✅ Logout → cookies cleared
# ✅ Try XSS: document.cookie → should not see httpOnly cookies
```

#### Rollback Plan

If issues occur in production:

1. Backend: Keep old `/auth/login` endpoint that returns token in response body
2. Frontend: Add flag to switch between localStorage and cookies
3. Gradually migrate users to cookie-based auth
4. Monitor error rates and rollback if needed

#### Security Score Improvement

| Metric              | Before         | After               | Improvement |
| ------------------- | -------------- | ------------------- | ----------- |
| **XSS Protection**  | ❌ None        | ✅ httpOnly         | HIGH        |
| **CSRF Protection** | ✅ None needed | ✅ samesite=strict  | HIGH        |
| **Token Lifetime**  | ❌ Long-lived  | ✅ Short + rotation | MEDIUM      |
| **Overall Score**   | 4/10           | 8/10                | +100%       |

---

## ⚪ Low Priority (Post-Launch)

**Goal:** Polish and long-term improvements  
**Estimated effort:** 6-9 hours  
**Prerequisites:** None - can be done anytime  
**Owner:** Frontend team

---

### 9. Optimize Ant Design Bundle

**Effort:** 1-2 hours  
**Priority:** LOW  
**Status:** ⚪ Post-launch

#### Current Status

- Ant Design vendor chunk: 1,274 KB (390 KB gzipped)
- Tree-shaking should work automatically with ES modules
- Manual imports may reduce bundle further

#### What to Try

```tsx
// Instead of:
import { Button, Table } from "antd";

// Try:
import Button from "antd/es/button";
import Table from "antd/es/table";
```

Run bundle analyzer before/after to measure impact.

---

### 10. Add Route Preloading

**Effort:** 1 hour  
**Priority:** LOW  
**Status:** ⚪ Post-launch

#### Why

- Faster perceived navigation
- Load route chunks on hover/focus
- Users feel app is more responsive

#### What to Build

```tsx
// preload-route.ts
export function preloadRoute(routeName: string) {
  const route = routes[routeName];
  if (route && route.lazy) {
    route.lazy(); // Trigger lazy import
  }
}

// In navigation component:
<Link
  to="/projects"
  onMouseEnter={() => preloadRoute("projects")}
  onFocus={() => preloadRoute("projects")}
>
  Projects
</Link>;
```

---

### 11. Add Visual Regression Tests

**Effort:** 4-6 hours  
**Priority:** LOW  
**Status:** ⚪ Post-launch

#### Why

- Catch unintended UI changes
- Automated screenshot comparison
- Prevents visual bugs in production

#### What to Setup

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: "only-on-failure",
  },
});

// tests/visual/dashboard.spec.ts
test("dashboard matches snapshot", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveScreenshot("dashboard.png");
});
```

---

## 📅 Recommended Timeline

### Week 1 (This Week - 10-12h) - Frontend

- ✅ TypeScript errors fixed (DONE)
- 🟢 Add loading skeletons (2-3h)
- 🟢 Convert hooks to RTK Query (4-6h)
- 🟢 Add error tracking (1-2h)

### Week 2 (Backend + Integration - 16-20h) - Backend + Frontend

- 🟡 Backend implements API endpoints (backend team)
- 🟡 Frontend API integration (4-6h)
- 🟡 Add virtualization (3-4h)
- 🟡 Increase test coverage (8-12h)

### Week 3 (Security - 10h) - Backend + Frontend

- 🔴 JWT security fix (8h backend + 2h frontend)
- Performance optimization
- Route preloading

### Post-Launch (Ongoing) - Frontend

- ⚪ Visual regression tests (4-6h)
- ⚪ Bundle optimization (1-2h)
- ⚪ Monitoring & analytics
- ⚪ Accessibility improvements

---

## 📊 Progress Tracking

### Sprint 1 (Week 1)

- [ ] Task 1: Loading skeletons (2-3h)
  - [ ] TableSkeleton component
  - [ ] CardSkeleton component
  - [ ] BoardSkeleton component
  - [ ] Update ProjectsTable
  - [ ] Update ProjectList
  - [ ] Update BacklogBoard

- [ ] Task 2: Hook migration (4-6h)
  - [ ] use-backlog → storiesApi
  - [ ] use-projects-overview → projectsApi
  - [ ] use-profile → settingsApi
  - [ ] use-preferences → settingsApi
  - [ ] use-password-change → settingsApi

- [ ] Task 3: Error tracking (1-2h)
  - [ ] Install Sentry
  - [ ] Configure Sentry
  - [ ] Update ErrorBoundary
  - [ ] Update error-handler
  - [ ] Test error reporting

### Sprint 2 (Week 2)

- [ ] Task 4: Backend API (backend team)
  - [ ] Projects endpoints (6 routes)
  - [ ] Stories endpoints (7 routes)
  - [ ] Settings endpoints (6 routes)
  - [ ] Deploy to staging
  - [ ] API documentation

- [ ] Task 5: API Integration (4-6h)
  - [ ] Update base URL
  - [ ] Remove mocks
  - [ ] Integration testing
  - [ ] Error scenario testing

- [ ] Task 6: Virtualization (3-4h)
  - [ ] Install @tanstack/react-virtual
  - [ ] Virtualize BacklogBoard
  - [ ] Virtualize ProjectsTable
  - [ ] Performance testing

- [ ] Task 7: Test coverage (8-12h)
  - [ ] RTK Query API tests
  - [ ] ErrorBoundary tests
  - [ ] Lazy loading tests
  - [ ] Hook tests
  - [ ] Verify 70%+ coverage

### Sprint 3 (Week 3)

- [ ] Task 8: JWT Security (10h)
  - [ ] Backend: httpOnly cookies (8h)
  - [ ] Backend: Token refresh (included)
  - [ ] Frontend: Remove localStorage (2h)
  - [ ] Frontend: Cookie support (included)
  - [ ] Security testing

---

## 🚨 Blockers & Dependencies

| Task               | Blocker                     | Impact   | Mitigation                      |
| ------------------ | --------------------------- | -------- | ------------------------------- |
| #5 API Integration | Backend endpoints not ready | HIGH     | Start with task #1-3, #6-7      |
| #8 JWT Security    | Backend availability        | CRITICAL | Schedule early, allocate 2 days |

---

## 📞 Communication

**Daily Standup Topics:**

- Frontend team: Progress on tasks #1-3
- Backend team: API implementation timeline
- Both teams: JWT security planning

**Weekly Sync:**

- Review completed tasks
- Adjust timeline if blockers occur
- Plan next sprint

**Escalation:**

- If backend delayed > 1 week → escalate to project manager
- If JWT security blocked → escalate to security team

---

**Last updated:** April 30, 2026  
**Next review:** May 7, 2026 (end of Week 1)

---

## Quick Start Commands

```bash
# Start development
npm run dev

# Type check
npm run type-check

# Run tests
npm run test:unit
npm run test:e2e

# Build for production
npm run build
npm run build:analyze

# Lint and format
npm run lint
npm run lint:fix
npm run format

# Pre-commit (runs automatically)
.husky/check-secrets.sh
npx lint-staged
```
