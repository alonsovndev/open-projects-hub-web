# Development Concepts, Principles & Patterns

Core engineering standards, architectural patterns, and best practices used in this codebase.

## Philosophy

This codebase follows these core principles:

| Principle                         | Description                                            |
| --------------------------------- | ------------------------------------------------------ |
| **Single Responsibility**         | Each file, component, and function does one thing well |
| **Explicit Over Implicit**        | Clear naming and types over clever abbreviations       |
| **Composition Over Inheritance**  | Build complex UIs from simple components               |
| **Convention Over Configuration** | Standard patterns reduce decision fatigue              |
| **Test What Matters**             | Behavior tests over implementation tests               |

---

## Core Concepts

### 1. Feature-Based Architecture

Features are self-contained modules with their own:

```
features/<feature>/
  ├── api/          # RTK Query endpoints
  ├── components/   # UI components
  ├── hooks/       # Custom hooks
  ├── pages/       # Route pages
  ├── routes/      # Route definitions
  ├── state/       # Redux slices
  ├── types/        # Feature types
  └── config/       # Feature configuration
```

**Why**: Reduces coupling, enables independent feature development, clarifies ownership.

**Example**: Authentication is entirely in `features/auth/`. No auth logic leaks into dashboard or projects.

---

### 2. Layered Architecture

```
src/
├── app/              # App infrastructure
│   ├── api/          # RTK Query base
│   ├── router/       # Routing setup
│   └── store/       # Redux store
│
├── config/           # App configuration
│
├── features/         # Business features
│   ├── auth/
│   ├── backlog/
│   ├── dashboard/
│   └── projects/
│
└── shared/           # Cross-feature code
    ├── components/   # Reusable components
    ├── hooks/        # Reusable hooks
    ├── types/       # Shared types
    └── utils/       # Utilities
```

---

### 3. API-First Data Fetching

All server data flows through RTK Query:

```typescript
// ✅ CORRECT - All data through RTK Query
const { data, isLoading } = useGetProjectsQuery();

// ❌ WRONG - Manual fetch in useEffect
const [projects, setProjects] = useState([]);
useEffect(() => {
  fetch("/api/projects").then(setProjects);
}, []);
```

**Why**: Automatic caching, deduplication, loading states, error handling, optimistic updates.

---

### 4. Client vs Server State

| State Type       | Storage         | When to Use                    |
| ---------------- | --------------- | ------------------------------ |
| **Server State** | RTK Query cache | API data, cached responses     |
| **Client State** | Redux store     | Auth session, UI preferences   |
| **Local State**  | useState        | Form inputs, toggle visibility |

**Decision Tree**:

```
Does the data come from an API?
├─ YES → Use RTK Query
│
├─ NO → Is it used across multiple features?
│   ├─ YES → Use Redux slice
│   │
│   └─ NO → Is it used in one component only?
│       └─ YES → Use useState
```

---

## Design Patterns

### 1. Container/Presenter Pattern

Separate data fetching from rendering:

```typescript
// Container - handles data
const ProjectsContainer: FC = () => {
  const { data, isLoading } = useGetProjectsQuery();

  if (isLoading) return <Loading />;

  return <ProjectsPresenter projects={data} />;
};

// Presenter - handles rendering
const ProjectsPresenter: FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <List>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </List>
  );
};
```

**Why**: Tester-friendly, reusable presenter, clearer component responsibilities.

---

### 2. Hook Composition Pattern

Combine small hooks into complex behavior:

```typescript
// Combine small hooks
const useProjectForm = (projectId?: string) => {
  const project = useProject(projectId);
  const validation = useProjectValidation();
  const submission = useProjectSubmission();

  return {
    ...project,
    ...validation,
    ...submission,
  };
};

// Usage
const Form = () => {
  const { data, validate, submit, isSubmitting } = useProjectForm(projectId);
  // ...
};
```

---

### 3. Higher-Order Component Pattern

Add behavior to components:

```typescript
// withLoading HOC
const withLoading = <P extends object>(
  Component: FC<P>
): FC<P & { isLoading?: boolean }> => {
  return ({ isLoading, ...props }) => {
    if (isLoading) return <Spin />;
    return <Component {...(props as P)} />;
  };
};

// Usage
const LoadingProjects = withLoading(Projects);
<LoadingProjects isLoading={isLoading} projects={data} />;
```

---

### 4. Render Prop Pattern

Share rendering logic:

```typescript
// DataRenderer manages loading/error states
const DataRenderer = <T,>({
  query,
  render,
}: {
  query: { data?: T; isLoading: boolean; error?: unknown };
  render: (data: T) => ReactNode;
}) => {
  const { data, isLoading, error } = query;

  if (isLoading) return <Spin />;
  if (error) return <Alert message="Error" />;
  if (!data) return null;

  return render(data);
};

// Usage
<DataRenderer
  query={useGetProjectsQuery()}
  render={(projects) => <List items={projects} />}
/>
```

---

### 5. Custom Hook Pattern

Extract stateful logic:

```typescript
// Encapsulate complex logic
const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const next = () => setPage(p => p + 1);
  const prev = () => setPage(p => Math.max(1, p - 1));
  const go = (newPage: number) => setPage(newPage);

  return { page, next, prev, go, setPage };
};

// Usage
const MyComponent = () => {
  const { page, next, prev } = usePagination();
  return <Pagination page={page} onNext={next} onPrev={prev} />;
};
```

---

### 6. Optimistic Update Pattern

Update UI before server confirms:

```typescript
// RTK Query handles optimistic updates
const storiesApi = createApi({
  endpoints: (builder) => ({
    updateStoryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/stories/${id}`,
        method: "PATCH",
        body: { status },
      }),
      // Optimistic update cache
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          storiesApi.util.updateQueryData("getBacklogStories", undefined, (draft) => {
            const story = draft.find((s) => s.id === id);
            if (story) story.status = status;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Rollback on failure
        }
      },
    }),
  }),
});
```

---

### 7. Error Boundary Pattern

Catch render errors gracefully:

```typescript
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Alert message="Something went wrong" type="error" />;
    }
    return this.props.children;
  }
}
```

---

### 8. Feature Flag Pattern

Toggle features conditionally:

```typescript
// Simple feature flag
const FEATURES = {
  newDashboard: import.meta.env.VITE_FEATURE_NEW_DASHBOARD === "true",
} as const;

// Usage
const Dashboard = FEATURES.newDashboard ? NewDashboard : LegacyDashboard;
```

---

### 9. Barrel Export Pattern

Clean public APIs:

```typescript
// features/auth/index.ts - Barrel export
export { LoginForm } from "./components/login-form";
export { useLoginMutation } from "./api/auth-api";
export { authRoutes } from "./routes/auth.routes";
export type { LoginValues, UserSession } from "./types";
```

**Why**: Clean imports, encapsulation, easy refactoring.

---

### 10. Lazy Loading Pattern

Code-split routes:

```typescript
// Route definition
const DashboardPage = lazy(() => import("./pages/dashboard"));

// App router
<Suspense fallback={<Loading />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Suspense>
```

---

## Coding Principles

### 1. Explicit Typing

```typescript
// ❌ Bad - Implicit typing
const handleSubmit = (data) => { ... };

// ✅ Good - Explicit typing
interface FormData {
  name: string;
  email: string;
}
const handleSubmit = (data: FormData) => { ... };
```

### 2. Fail Fast

```typescript
// ❌ Bad - Silent failure
const getUser = (id: string) => {
  const user = users.find((u) => u.id === id);
  return user?.name; // Returns undefined silently
};

// ✅ Good - Explicit failure
const getUser = (id: string): User => {
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error(`User not found: ${id}`);
  return user;
};
```

### 3. Early Return

```typescript
// ❌ Bad - Nested conditions
const getLabel = (user) => {
  if (user) {
    if (user.name) {
      if (user.role) {
        return `${user.name} (${user.role})`;
      }
    }
  }
  return "Unknown";
};

// ✅ Good - Early return
const getLabel = (user) => {
  if (!user?.name) return "Unknown";
  if (!user.role) return user.name;
  return `${user.name} (${user.role})`;
};
```

### 4. Single Responsibility

```typescript
// ❌ Bad - Multiple responsibilities
const processUser = (user) => {
  validateUser(user);        // Validation
  saveUser(user);          // Storage
  sendWelcomeEmail(user); // Communication
  notifyAdmin(user);     // Notification
};

// ✅ Good - Separated concerns
const validateUser = (user) => { ... };
const saveUser = (user) => { ... };
const sendWelcomeEmail = (user) => { ... };
const notifyAdmin = (user) => { ... };
```

### 5. Dependency Injection

```typescript
// ❌ Bad - Hard dependency
class UserService {
  private api = new ApiClient();

  getUser(id) {
    return this.api.get(`/users/${id}`);
  }
}

// ✅ Good - Injected dependency
class UserService {
  constructor(private api: ApiClient) {}

  getUser(id) {
    return this.api.get(`/users/${id}`);
  }
}
```

### 6. Immutability

```typescript
// ❌ Bad - Mutating state
const updateUser = (user, changes) => {
  user.name = changes.name; // Mutation
  return user;
};

// ✅ Good - Creating new object
const updateUser = (user, changes) => {
  return { ...user, ...changes }; // New object
};
```

### 7. Composition Over Inheritance

```typescript
// ❌ Bad - Deep inheritance hierarchy
class Admin extends UserManager extends Auth { ... }

// ✅ Good - Composition
const admin = {
  ...user,
  ...auth,
  ...permissions,
};
```

---

## Best Practices by Domain

### React Components

| Practice  | ✅ Do                     | ❌ Don't                 |
| --------- | ------------------------- | ------------------------ |
| Props     | Define explicit interface | Use `any`                |
| State     | Use `useState` for local  | Use Redux for everything |
| Memo      | Memoize expensive ops     | Memoize everything       |
| Effects   | Use for side effects      | Use for derived state    |
| Rendering | Keep simple               | Put logic in render      |

**Example - Explicit Props**:

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: () => void;
  size?: "small" | "medium" | "large";
}

export const UserCard: FC<UserCardProps> = ({ user, onEdit, size = "medium" }) => {
  // Implementation
};
```

---

### TypeScript

| Practice   | ✅ Do                       | ❌ Don't                  |
| ---------- | --------------------------- | ------------------------- |
| Types      | Define explicit interfaces  | Use `any`                 |
| Imports    | Use `import type` for types | Import types as values    |
| Generics   | Use for reusable logic      | Over-engineer simple code |
| Validation | Use Zod for runtime         | Trust API blindly         |
| Errors     | Use custom error types      | Use generic `Error`       |

**Example - Runtime Validation**:

```typescript
import { z } from "zod";

// Define schema
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

// Validate runtime
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

// Or validate async
const validateUserAsync = async (data: unknown): Promise<User> => {
  return UserSchema.parseAsync(data);
};
```

---

### API Integration

| Practice | ✅ Do                | ❌ Don't                    |
| -------- | -------------------- | --------------------------- |
| Fetching | Use RTK Query        | Fetch in useEffect          |
| Errors   | Handle explicitly    | Swallow errors              |
| Loading  | Show loading state   | Hide behind generic spinner |
| Auth     | Add to headers       | Forget auth token           |
| Caching  | Let RTK Query handle | Implement manually          |

**Example - Error Handling**:

```typescript
const { data, error } = useGetProjectsQuery();

if (isLoading) return <Skeleton />;

if (error) {
  if ("status" in error && error.status === 401) {
    return <Navigate to="/login" />;
  }
  return <Alert message="Failed to load projects" type="error" />;
}

return <ProjectList projects={data} />;
```

---

### Redux State

| Practice    | ✅ Do                 | ❌ Don't                  |
| ----------- | --------------------- | ------------------------- |
| Slices      | One slice per feature | Giant combined slice      |
| Actions     | Use payload creators  | Dispatch objects manually |
| Selectors   | Memoize with reselect | Compute in render         |
| Persistence | Use localStorage      | Keep in Redux only        |

---

### Testing

| Practice   | ✅ Do                 | ❌ Don't               |
| ---------- | --------------------- | ---------------------- |
| Focus      | Test behavior         | Test implementation    |
| Mocking    | Mock APIs/stores      | Mock everything        |
| Assertions | Use specific matchers | Use generic assertions |
| Structure  | Arrange-Act-Assert    | Test without arrange   |

**Example - Good Test Structure**:

```typescript
describe("LoginForm", () => {
  it("should show error for invalid credentials", async () => {
    // Arrange
    server.use(
      rest.post("/api/auth/login", (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
      })
    );

    render(<LoginForm />);

    // Act
    await userEvent.type(screen.getByLabelText(/email/), "invalid@test.com");
    await userEvent.type(screen.getByLabelText(/password/), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Assert
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

---

### Error Handling

| Practice      | ✅ Do                    | ❌ Don't               |
| ------------- | ------------------------ | ---------------------- |
| Boundaries    | Wrap top levels          | Ignore errors          |
| Logging       | Log with context         | Log generically        |
| User Feedback | Show meaningful messages | Show technical details |
| Recovery      | Provide retry options    | Leave broken UI        |

```typescript
// ✅ Good - Contextual error
console.error("Failed to fetch projects", {
  endpoint: "/api/projects",
  userId: user.id,
  error: error.message,
});
```

---

### Performance

| Practice    | ✅ Do                 | ❌ Don't               |
| ----------- | --------------------- | ---------------------- |
| Memoization | Memoize expensive ops | Premature optimization |
| Lists       | Virtualize long lists | Render all items       |
| Images      | Use lazy loading      | Load all images        |
| Routes      | Lazy load routes      | Bundle everything      |
| Bundles     | Analyze with tooling  | Guess optimization     |

---

## Code Review Checklist

Before submitting PR, verify:

- [ ] **Types**: Explicit types, no `any`
- [ ] **Naming**: Clear, descriptive names
- [ ] **Testing**: Behavior tested, not implementation
- [ ] **Error Handling**: Errors caught and handled
- [ ] **Performance**: No obvious issues
- [ ] **Security**: No secrets exposed
- [ ] **Accessibility**: Semantic HTML, ARIA where needed

---

## Related Documentation

- **[Conventions](./conventions.md)** - Naming and import rules
- **[State Management](./state-management.md)** - Redux + RTK Query
- **[Testing](./testing.md)** - Testing patterns
- **[Tech Stack](./tech-stack.md)** - Technology choices
- **[Architecture Overview](./architecture/overview.md)** - System design
