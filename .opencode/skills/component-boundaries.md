# Component Boundaries

## Goal

Keep components small, understandable, and easy to evolve within a feature-based architecture.

## When to Split a Component

Split a component when it:

1. Handles more than one visual section
2. Renders repeated card or option markup
3. Mixes static configuration data with render logic
4. Acts like an entire page instead of a component
5. Contains unrelated responsibilities (header, selection grid, footer together)
6. Exceeds ~150 lines of code
7. Becomes hard to understand in under 2 minutes

## Component Placement Strategy

### Feature-Owned Components

**When to use:** Component is specific to one business domain

**Location:** `src/features/<feature>/components/`

**Example:**
```text
src/features/auth/components/login-form/
  LoginForm.tsx
  login-form.module.scss
  index.ts
```

**Characteristics:**
- Used only by this feature
- Contains feature-specific business logic
- Tightly coupled to feature data models
- Not exported in feature public API (unless needed by pages)

### Shared Components

**When to use:** Component is genuinely used by multiple features

**Location:** `src/shared/components/`

**Example:**
```text
src/shared/components/layout/app-header/
  AppHeader.tsx
  app-header.module.scss
  index.ts
```

**Characteristics:**
- Used by 2+ features
- Generic and reusable
- No feature-specific business logic
- Configurable via props

### Don't Prematurely Share

❌ **Bad:**
```text
// Moving to shared after 1 use
src/shared/components/user-avatar/  # Only used by auth feature
```

✅ **Good:**
```text
// Keep in feature until proven shared
src/features/auth/components/user-avatar/  # Used only here
```

**Duplication is better than wrong abstraction.**

## Preferred Component Structure

### Bad Structure (Monolithic)

```typescript
// ❌ BAD - One component does everything
export const HomePage: FC = () => {
  return (
    <div>
      {/* Header */}
      <header>
        <img src="/logo.svg" alt="Logo" />
        <h1>Welcome</h1>
      </header>

      {/* Hero */}
      <section>
        <h2>Get Started</h2>
        <p>Choose your role...</p>
      </section>

      {/* Role Selection */}
      <section>
        {[
          { id: 1, title: "Admin", path: "/admin" },
          { id: 2, title: "Client", path: "/client" },
          { id: 3, title: "Viewer", path: "/viewer" },
        ].map((role) => (
          <div key={role.id} className="card">
            <h3>{role.title}</h3>
            <Link to={role.path}>Enter</Link>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </footer>
    </div>
  );
};
```

### Good Structure (Modular)

**Page (Composition Layer):**
```typescript
// ✅ GOOD - Page composes feature components
// pages/home/index.tsx
import type { FC } from "react";
import { HomeHero } from "@/features/home";
import { RoleSelection } from "@/features/home";
import styles from "./home.module.scss";

export const Home: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <HomeHero />
      <RoleSelection />
    </div>
  );
};
```

**Feature Components:**
```typescript
// features/home/components/home-hero/HomeHero.tsx
export const HomeHero: FC = () => {
  return (
    <section className={styles.hero}>
      <h1>Welcome to Open Projects Hub</h1>
      <p>Choose your role to get started</p>
    </section>
  );
};

// features/home/components/role-selection/RoleSelection.tsx
import { homeRoles } from "@/resources/config/home-roles";
import { RoleCard } from "./RoleCard";

export const RoleSelection: FC = () => {
  return (
    <section className={styles.roleGrid}>
      {homeRoles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </section>
  );
};

// features/home/components/role-selection/RoleCard.tsx
export const RoleCard: FC<RoleCardProps> = ({ role }) => {
  return (
    <article className={styles.card}>
      <h3>{role.title}</h3>
      <p>{role.description}</p>
      <Link to={role.path}>Enter</Link>
    </article>
  );
};
```

**Configuration:**
```typescript
// resources/config/home-roles.ts
export const homeRoles = [
  {
    id: 1,
    title: "Admin",
    description: "Manage projects and users",
    path: "/admin",
  },
  {
    id: 2,
    title: "Client",
    description: "View project progress",
    path: "/client",
  },
  {
    id: 3,
    title: "Viewer",
    description: "Browse public projects",
    path: "/viewer",
  },
];
```

**Layout (Shared):**
```typescript
// shared/components/layout/footer/Footer.tsx
export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/terms">Terms of Service</Link>
      <Link to="/contact">Contact Us</Link>
    </footer>
  );
};
```

## Data Separation

### Move Data Out of Components

❌ **Bad - Data in component:**
```typescript
export const RoleSelection: FC = () => {
  const roles = [
    { id: 1, title: "Admin", description: "...", path: "/admin" },
    { id: 2, title: "Client", description: "...", path: "/client" },
    { id: 3, title: "Viewer", description: "...", path: "/viewer" },
  ];

  return (
    <section>
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </section>
  );
};
```

✅ **Good - Data in config:**
```typescript
// resources/config/home-roles.ts
export const homeRoles = [
  { id: 1, title: "Admin", description: "...", path: "/admin" },
  { id: 2, title: "Client", description: "...", path: "/client" },
  { id: 3, title: "Viewer", description: "...", path: "/viewer" },
];

// features/home/components/role-selection/RoleSelection.tsx
import { homeRoles } from "@/resources/config/home-roles";

export const RoleSelection: FC = () => {
  return (
    <section>
      {homeRoles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </section>
  );
};
```

## Logic Separation

### Extract Logic to Hooks

❌ **Bad - Logic in component:**
```typescript
export const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation logic...
    const newErrors: ValidationErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email";
    }
    if (password.length < 8) {
      newErrors.password = "Password too short";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setSession(result.session));
    } catch (err) {
      setErrors({ general: "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form JSX */}
    </form>
  );
};
```

✅ **Good - Logic in hook:**
```typescript
// features/auth/hooks/use-login-form.ts
export const useLoginForm = () => {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  
  const handleSubmit = async (values: LoginValues) => {
    const result = await login(values).unwrap();
    dispatch(setSession(result.session));
  };

  return {
    handleSubmit,
    loading: false, // From RTK Query
    error: null,    // From RTK Query
  };
};

// features/auth/components/login-form/LoginForm.tsx
export const LoginForm: FC = () => {
  const { handleSubmit, loading, error } = useLoginForm();

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name="email" rules={[{ type: "email" }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ min: 8 }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Sign In
      </Button>
    </Form>
  );
};
```

## Component Naming

### Component Files and Folders

```text
✅ GOOD:
features/auth/components/login-form/
  LoginForm.tsx           # PascalCase component
  login-form.module.scss  # kebab-case styles
  index.ts                # Barrel export

❌ BAD:
features/auth/components/
  loginForm.tsx           # Wrong case
  LoginForm.scss          # Not a module
  LoginFormStyles.scss    # Wrong naming
```

### Component Exports

```typescript
// ✅ GOOD - Named export with barrel
// LoginForm.tsx
export const LoginForm: FC = () => { /* ... */ };

// index.ts
export { LoginForm } from "./LoginForm";

// Usage
import { LoginForm } from "@/features/auth/components/login-form";
```

## Component Communication

### Props Down, Events Up

```typescript
// ✅ GOOD - Props down, callbacks up
interface RoleCardProps {
  role: HomeRole;
  onSelect?: (roleId: number) => void;
}

export const RoleCard: FC<RoleCardProps> = ({ role, onSelect }) => {
  return (
    <article onClick={() => onSelect?.(role.id)}>
      <h3>{role.title}</h3>
    </article>
  );
};

// Parent
<RoleCard role={role} onSelect={handleRoleSelect} />
```

### Context for Deep Trees

Use context sparingly and only for truly global state:

```typescript
// ✅ GOOD - Feature-specific context
// features/wizard/context/WizardContext.tsx
export const WizardContext = createContext<WizardContextValue>(null);

export const WizardProvider: FC = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  return (
    <WizardContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </WizardContext.Provider>
  );
};
```

## Review Checklist

Before finalizing a component, ask:

1. ✅ Can this component be understood in under 2 minutes?
2. ✅ Is it clear where to add a new option/feature?
3. ✅ Is the component focused on one concern?
4. ✅ Is data separated from presentation?
5. ✅ Is complex logic extracted to hooks?
6. ✅ Is the component in the right location (feature vs. shared)?
7. ✅ Does it follow naming conventions?
8. ✅ Is it easy to test?

## Anti-Patterns to Avoid

### 1. God Components

❌ Component does everything (rendering, state, API, routing)

✅ Split into presentation, logic (hooks), and data (config/API)

### 2. Premature Abstraction

❌ Moving to `shared/` after first use

✅ Keep in feature until proven shared by 2+ features

### 3. Deep Nesting

❌ Components nested 5+ levels deep

✅ Flatten hierarchy, extract intermediate components

### 4. Inline Data

❌ Large data arrays/objects in component files

✅ Move to `resources/config/` or use RTK Query

### 5. Logic Soup

❌ 200+ lines of hooks, state, effects in one component

✅ Extract to custom hooks in `features/<feature>/hooks/`

## Summary

Good component boundaries achieve:

- ✅ **Single Responsibility** - Each component does one thing
- ✅ **Easy to Understand** - Clear, focused, readable
- ✅ **Easy to Test** - Small, isolated, predictable
- ✅ **Easy to Change** - Loosely coupled, well-organized
- ✅ **Properly Located** - Feature-owned or shared based on actual usage
- ✅ **Data Separated** - Config in config files, logic in hooks
- ✅ **Clean Naming** - Follows conventions consistently
