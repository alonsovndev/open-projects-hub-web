# Conventions

Naming, imports, file placement, and code organization standards.

## File Naming Conventions

| Type              | Convention                      | Example                          |
| ----------------- | ------------------------------- | -------------------------------- |
| Components        | PascalCase                      | `HomePageCarousel.tsx`           |
| Component folders | kebab-case                      | `requirements-viewer/`           |
| Pages             | `index.tsx` in lowercase folder | `src/pages/home/index.tsx`       |
| Hooks             | kebab-case                      | `use-login-form.ts`              |
| Utilities         | kebab-case                      | `format-date.ts`                 |
| Config            | kebab-case                      | `clinic-information.ts`          |
| Mock data         | kebab-case                      | `all-clinic-services.ts`         |
| Stylesheets       | kebab-case                      | `home-page-carousel.module.scss` |
| Feature folders   | kebab-case                      | `auth/`, `dashboard/`            |
| Test files        | Match source                    | `password-policy.test.ts`        |

### Forbidden Patterns

❌ **Do NOT use redundant prefixes**:

- `admin-auth/` → Use `auth/`
- `client-viewer/` → Use `viewer/`
- `admin-dashboard/` → Use `dashboard/`

✅ **Use clean, descriptive names**:

- `auth/` - Authentication feature
- `dashboard/` - Dashboard feature
- `viewer/` - Viewer feature

## Import Conventions

### Import Order

1. External imports (React, third-party libraries)
2. Internal imports (grouped by layer)
3. Types
4. Styles

**Example**:

```typescript
import type { FC } from "react";
import { Button } from "antd";

import { AppHeader } from "@/shared/components/layout/app-header";
import { useAppDispatch } from "@/app/store/hooks";
import { LoginForm } from "@/features/auth";

import type { UserSession } from "@/features/auth";

import styles from "./dashboard.module.scss";
```

### Absolute vs Relative Imports

✅ **Use absolute imports for cross-module code**:

```typescript
import { LoginForm } from "@/features/auth";
import { useAppDispatch } from "@/app/store/hooks";
import { formatDate } from "@/shared/utils/format-date";
```

❌ **Avoid relative imports for cross-module**:

```typescript
import { LoginForm } from "../../../features/auth"; // Hard to maintain
```

✅ **Relative imports OK within same feature**:

```typescript
// Within features/auth/components/
import { validatePassword } from "../model/password-policy";
```

### Feature Public API Imports

✅ **Always use feature public APIs**:

```typescript
import { LoginForm, useLoginMutation } from "@/features/auth";
```

❌ **Never use deep imports**:

```typescript
import { LoginForm } from "@/features/auth/components/login-form/LoginForm";
```

### Barrel Exports

Use `index.ts` for clean exports:

```typescript
// features/auth/components/login-form/index.ts
export { LoginForm } from "./LoginForm";

// features/auth/index.ts
export { LoginForm } from "./components/login-form";
export { authRoutes } from "./routes";
export { authApi, useLoginMutation } from "./api/auth-api";
export type { LoginValues, UserSession } from "./types";
```

## Component Organization

### Component File Structure

```text
features/auth/components/admin-login-form/
  AdminLoginForm.tsx              # Component
  admin-login-form.module.scss    # Styles
  index.ts                        # Barrel export
```

### Component Template

```typescript
import type { FC } from "react";
import styles from "./admin-login-form.module.scss";

interface AdminLoginFormProps {
  onSubmit: (values: LoginValues) => void;
  isLoading?: boolean;
}

export const AdminLoginForm: FC<AdminLoginFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  return (
    <form className={styles.form}>
      {/* Component content */}
    </form>
  );
};
```

## Hook Organization

### Hook File Structure

```text
features/auth/hooks/
  use-admin-login-form.ts
  use-password-validation.ts
```

### Hook Template

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/auth-api";

export const useAdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login({ email, password }).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
  };
};
```

## TypeScript Conventions

### Type Definitions

```typescript
// Use interfaces for props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// Use type for unions
type ButtonVariant = "primary" | "secondary" | "danger";

// Use type for function signatures
type OnSubmit = (values: FormValues) => void;
```

### Type Imports

```typescript
import type { FC } from "react";
import type { UserSession } from "@/features/auth";
```

### Avoid `any`

```typescript
// ❌ Bad
const handleData = (data: any) => {};

// ✅ Good
interface ApiData {
  id: string;
  name: string;
}
const handleData = (data: ApiData) => {};

// ✅ Good - when shape is truly unknown
const handleData = (data: unknown) => {
  // Type guard before use
  if (isApiData(data)) {
    // Now typed
  }
};
```

## Code Organization Best Practices

### Keep Files Focused

Each file should have a single responsibility:

```text
// ✅ Good
features/auth/model/
  password-policy.ts      # Password validation rules
  password-strength.ts    # Password strength calculation
  email-validator.ts      # Email validation

// ❌ Bad
features/auth/utils/
  validators.ts           # 500 lines of mixed validators
```

### Colocate Related Code

```text
// ✅ Good
features/auth/components/login-form/
  LoginForm.tsx
  login-form.module.scss
  LoginForm.test.tsx
  index.ts

// ❌ Bad
src/components/LoginForm.tsx
src/styles/components/login-form.scss
src/tests/components/LoginForm.test.tsx
```

### Extract Reusable Logic

When logic is used 2-3 times, extract it:

```typescript
// ✅ Good - Extracted util
// shared/utils/format-date.ts
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US").format(date);
};

// ❌ Bad - Duplicated logic
const Component1 = () => {
  const formatted = new Intl.DateTimeFormat("en-US").format(date);
};
const Component2 = () => {
  const formatted = new Intl.DateTimeFormat("en-US").format(date);
};
```

### Keep Components Small

Split large components:

```typescript
// ✅ Good - Split by concern
<ProjectBacklogPage />
  ├─ <PageHeader />
  ├─ <ProjectSelector />
  └─ <StoryList />

// ❌ Bad - 500-line component
<ProjectBacklogPage>
  {/* Everything in one file */}
</ProjectBacklogPage>
```

## Configuration Management

### Static Config

```typescript
// resources/config/auth.ts
export const AUTH_CONFIG = {
  storageKey: "open-projects-hub.admin-session",
  endpoints: {
    login: "/auth/login",
    logout: "/auth/logout",
  },
  redirects: {
    afterLogin: "/dashboard",
    afterLogout: "/",
    unauthorized: "/unauthorized",
  },
} as const;
```

### Feature-Specific Config

```typescript
// features/dashboard/config/panels.ts
export const DASHBOARD_PANELS = [
  { id: "projects", title: "Projects", icon: "project" },
  { id: "refinement", title: "Refinement", icon: "form" },
] as const;
```

## Comment Conventions

### When to Comment

✅ **Do comment**:

- Complex business logic
- Non-obvious workarounds
- Public APIs and interfaces
- Why, not what

❌ **Don't comment**:

- Obvious code
- What the code does (code should be self-documenting)

**Example**:

```typescript
// ✅ Good - Explains WHY
// Backend returns inconsistent field names across versions
// We normalize to a single internal format
const normalizeUser = (apiUser: ApiUser): User => {
  return {
    name: apiUser.full_name || apiUser.name,
  };
};

// ❌ Bad - Explains WHAT (obvious)
// Get the user name
const name = user.name;
```

### JSDoc for Public APIs

```typescript
/**
 * Validates password against security policy.
 *
 * @param password - The password to validate
 * @returns Validation result with rule checks
 */
export const validatePassword = (password: string): ValidationResult => {
  // Implementation
};
```

## Error Handling Conventions

### Async Error Handling

```typescript
// ✅ Good - Try/catch with user feedback
const handleSubmit = async () => {
  try {
    await login(values).unwrap();
    navigate("/dashboard");
  } catch (error) {
    message.error("Login failed. Please check your credentials.");
    console.error("Login error:", error);
  }
};

// ❌ Bad - Silent failure
const handleSubmit = async () => {
  await login(values); // May fail silently
};
```

### Error Logging

```typescript
// ✅ Good - Structured logging
console.error("Failed to fetch users:", {
  endpoint: "/api/users",
  error: error.message,
});

// ❌ Bad - Generic logging
console.log(error);
```

## Testing Conventions

### Test File Placement

```text
// ✅ Good - Colocated
features/auth/model/
  password-policy.ts
  password-policy.test.ts

// ❌ Bad - Separated
features/auth/model/password-policy.ts
features/auth/tests/model/password-policy.test.ts
```

### Test Naming

```typescript
describe("validatePassword", () => {
  it("should return valid for strong password", () => {});
  it("should return invalid when password too short", () => {});
  it("should require at least one uppercase letter", () => {});
});
```

## Commit Conventions

### Commit Message Format

Use Conventional Commits:

```
<type>: <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

**Examples**:

```bash
feat: add user profile page
fix: resolve login redirect issue
docs: update architecture guide
refactor: extract password validation logic
test: add dashboard integration tests
```

### Commit Scope

Keep commits focused:

```bash
# ✅ Good - Single concern
feat: add login form validation
feat: add password strength indicator

# ❌ Bad - Multiple concerns
feat: add login form, dashboard page, and user profile
```

## Related Documentation

- **[Folder Structure](../architecture/folder-structure.md)** - Where to place files
- **[Styling](./styling.md)** - CSS and SCSS conventions
- **[Testing](./testing.md)** - Testing conventions
- **[Adding Features](../guides/adding-features.md)** - Complete workflow

## Summary

- ✅ Use kebab-case for files (except components)
- ✅ Use PascalCase for components
- ✅ Use feature public APIs (no deep imports)
- ✅ Use absolute imports for cross-module code
- ✅ Keep files focused and colocated
- ✅ Extract reusable logic after 2-3 uses
- ✅ Comment WHY, not WHAT
- ✅ Use Conventional Commits
