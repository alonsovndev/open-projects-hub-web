# Testing Strategy

## Philosophy

This project uses a **pragmatic multi-layer testing approach** that balances quality with velocity:

1. **Write tests for business-critical logic** - Focus on features that handle money, authentication, authorization, data validation, and user workflows
2. **Don't test implementation details** - Test behavior and outcomes, not internal structure
3. **Test what breaks often** - If a feature has bugs in production repeatedly, add tests
4. **Skip tests for simple UI** - Don't test purely presentational components with no logic
5. **Test complex logic separately** - Extract and test pure functions, validators, transformers, and calculators
6. **Use the right tool for the job** - Unit tests for logic, integration tests for features, E2E tests for user journeys

## Testing Layers

This project uses a three-layer testing approach:

### 1. Unit Tests (Vitest) - The Foundation

**Fast, Cheap, Many**

- Test individual functions and components in isolation
- Mock dependencies
- Run in milliseconds
- Use for: utilities, validators, Redux slices, pure functions

### 2. Integration Tests (React Testing Library + Vitest) - The Middle Layer

**Medium Speed, Medium Cost, Some**

- Test how components work together
- Test API integration
- Test complex hooks
- Use for: feature workflows, form submissions, component interactions

### 3. E2E Tests (Playwright) - The Top Layer

**Slow, Expensive, Few**

- Test complete user journeys
- Test cross-system integrations
- Run in real browsers
- Use for: critical flows, checkout, registration, login

## Testing Pyramid

```
           ╔═══════════════════════╗
           ║   E2E Tests           ║  ← Few (5-10% of tests)
           ║   (Playwright)        ║     Critical user journeys
           ║   Slow, Expensive     ║     Real browser, full stack
           ╚═══════════════════════╝
        ╔═════════════════════════════╗
        ║ Integration Tests           ║  ← Some (20-30% of tests)
        ║ (React Testing Library)     ║     Component interactions
        ║ Medium Speed, Medium Cost   ║     API integration
        ╚═════════════════════════════╝
   ╔════════════════════════════════════╗
   ║      Unit Tests                    ║  ← Many (60-70% of tests)
   ║      (Vitest)                      ║     Pure functions, logic
   ║      Fast, Cheap                   ║     Redux slices, utils
   ╚════════════════════════════════════╝
```

## When to Write Tests

### ✅ ALWAYS Test

1. **Authentication & Authorization Logic**
   - **Unit**: Token validation, session utilities
   - **Integration**: Login/logout component flows
   - **E2E**: Complete login → dashboard → logout journey

2. **Business Logic & Calculations**
   - **Unit**: Price calculations, discount/tax logic, validators
   - **Integration**: Form validation with business rules
   - **E2E**: Multi-step checkout with calculations

3. **Data Mutations**
   - **Unit**: Pure mutation logic and transformers
   - **Integration**: Form submissions, API mutation hooks
   - **E2E**: Create → Edit → Delete workflows

4. **Utility Functions**
   - **Unit**: Date formatters, currency formatters, parsers
   - **Integration**: N/A (utilities are pure)
   - **E2E**: N/A (utilities are pure)

5. **Custom Hooks with Logic**
   - **Unit**: Hook state management logic
   - **Integration**: Hook integration with components
   - **E2E**: N/A (hooks are internal)

### ⚠️ CONSIDER Testing

1. **Complex UI Components**
   - **Unit**: Component logic and state
   - **Integration**: Multi-step forms, data tables with filters
   - **E2E**: Complex wizards, search flows, filter combinations

2. **Feature Workflows**
   - **Unit**: Workflow validators and utilities
   - **Integration**: Individual workflow steps
   - **E2E**: ⭐ **PREFERRED** - Complete user registration, checkout, admin CRUD

3. **Error Handling**
   - **Unit**: Error parsing and formatting
   - **Integration**: API error responses, validation display
   - **E2E**: Error recovery flows (retry, fallback)

### ❌ DON'T Test (Usually)

1. **Simple Presentational Components**
   - Static hero sections
   - Footer components
   - Simple card layouts
   - Pure CSS/styling

2. **Third-Party Libraries**
   - Ant Design components
   - React Router
   - Redux Toolkit

3. **Configuration Files**
   - Mock data
   - Static config
   - Constants

### 🎯 E2E Testing - When to Use

Use E2E tests (Playwright) for:

✅ **Critical User Journeys**:

- Complete authentication flow (login → access protected page → logout)
- Purchase/checkout flow (browse → add to cart → checkout → confirmation)
- User registration and onboarding
- Password reset flow

✅ **Cross-System Integration**:

- Payment gateway integration
- Third-party service integration
- Email verification flows

✅ **Role-Based Workflows**:

- Admin creating/editing users
- Different user roles accessing different features
- Permission enforcement across pages

✅ **Complex Multi-Step Processes**:

- Multi-page wizards
- Search → filter → sort → view details
- Form submission → approval → notification

❌ **Don't Use E2E For**:

- Simple component behavior (use unit/integration tests)
- Pure logic and calculations (use unit tests)
- Single-page interactions (use integration tests)
- Utility function testing (use unit tests)

## Where to Put Tests

### Feature Tests

Place feature-specific tests in the feature's `tests/` folder:

```
src/features/auth/
  api/
    auth-api.ts
  components/
    LoginForm.tsx
  hooks/
    use-login.ts
  model/
    validators.ts
  state/
    auth-slice.ts
  tests/
    auth-api.test.ts          ← Test API integration
    auth-slice.test.ts        ← Test Redux logic
    validators.test.ts        ← Test pure validation functions
    use-login.test.ts         ← Test hook behavior
    LoginForm.test.tsx        ← Integration test for form
  types/
  routes.tsx
  index.ts
```

### Shared Tests

Place shared utility tests next to the file being tested:

```
src/shared/
  utils/
    format-date.ts
    format-date.test.ts      ← Colocated with implementation
  hooks/
    use-debounce.ts
    use-debounce.test.ts     ← Colocated with implementation
```

### Component Tests

For complex shared components, colocate tests:

```
src/shared/components/ui/
  app-form/
    AppForm.tsx
    AppForm.test.tsx         ← Colocated with component
    app-form.module.scss
    index.ts
```

## What to Test

### 1. Unit Tests - Pure Functions (HIGHEST PRIORITY)

**Where**: `src/features/<feature>/model/` or `src/shared/utils/`

**Test**: Input → Output behavior

**Example**:

```typescript
// src/shared/utils/format-currency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// src/shared/utils/format-currency.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formats positive amounts correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative amounts correctly", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });
});
```

### 2. Redux Slices & State Logic

**Where**: `src/features/<feature>/tests/`

**Test**: Actions, reducers, selectors

**Example**:

```typescript
// src/features/auth/tests/auth-slice.test.ts
import { describe, it, expect } from "vitest";
import authReducer, { login, logout } from "../state/auth-slice";

describe("auth slice", () => {
  it("should handle login", () => {
    const state = authReducer(
      undefined,
      login({
        user: { id: "1", name: "Test User" },
        token: "abc123",
      })
    );

    expect(state.session).toBeDefined();
    expect(state.session?.user.name).toBe("Test User");
  });

  it("should handle logout", () => {
    const initialState = {
      session: { user: { id: "1", name: "Test" }, token: "abc" },
    };

    const state = authReducer(initialState, logout());
    expect(state.session).toBeNull();
  });
});
```

### 3. Custom Hooks

**Where**: `src/features/<feature>/tests/` or colocated

**Test**: Hook behavior using `@testing-library/react-hooks`

**Example**:

```typescript
// src/features/auth/tests/use-login.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useLogin } from "../hooks/use-login";

describe("useLogin", () => {
  it("should handle successful login", async () => {
    const { result } = renderHook(() => useLogin());

    result.current.handleLogin("user@example.com", "password123");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
```

### 4. API Integration (RTK Query)

**Where**: `src/features/<feature>/tests/`

**Test**: Mock API responses and verify hook behavior

**Example**:

```typescript
// src/features/viewer/tests/viewer-api.test.ts
import { describe, it, expect } from "vitest";
import { setupApiStore } from "@/test/utils/store-utils";
import { viewerApi } from "../api/viewer-api";

describe("viewerApi", () => {
  it("should fetch clinic services", async () => {
    const storeRef = setupApiStore(viewerApi);

    const promise = storeRef.store.dispatch(viewerApi.endpoints.getClinicServices.initiate());

    const result = await promise;
    expect(result.data).toBeDefined();
    expect(result.data?.length).toBeGreaterThan(0);
  });
});
```

### 5. Component Integration Tests

**Where**: `src/features/<feature>/tests/` or colocated

**Test**: User interactions and component behavior

**Example**:

```typescript
// src/features/auth/tests/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad** (testing implementation):

```typescript
it("should call setState with updated value", () => {
  const { result } = renderHook(() => useCounter());
  const setStateSpy = vi.spyOn(result.current, "setState");
  result.current.increment();
  expect(setStateSpy).toHaveBeenCalled();
});
```

✅ **Good** (testing behavior):

```typescript
it("should increment counter when increment is called", () => {
  const { result } = renderHook(() => useCounter());
  result.current.increment();
  expect(result.current.count).toBe(1);
});
```

### 2. Use Descriptive Test Names

❌ **Bad**:

```typescript
it('works', () => { ... });
it('test 1', () => { ... });
```

✅ **Good**:

```typescript
it('should return formatted currency with dollar sign', () => { ... });
it('should redirect to login when user is not authenticated', () => { ... });
```

### 3. Arrange-Act-Assert Pattern

```typescript
it("should calculate total with tax", () => {
  // Arrange - Set up test data
  const subtotal = 100;
  const taxRate = 0.08;

  // Act - Execute the function
  const total = calculateTotal(subtotal, taxRate);

  // Assert - Verify the result
  expect(total).toBe(108);
});
```

### 4. Keep Tests Independent

❌ **Bad** (tests depend on each other):

```typescript
let user;

it("should create user", () => {
  user = createUser("John");
  expect(user).toBeDefined();
});

it("should update user", () => {
  user.name = "Jane"; // Depends on previous test!
  expect(user.name).toBe("Jane");
});
```

✅ **Good** (independent tests):

```typescript
it("should create user", () => {
  const user = createUser("John");
  expect(user).toBeDefined();
});

it("should update user", () => {
  const user = createUser("John");
  user.name = "Jane";
  expect(user.name).toBe("Jane");
});
```

### 5. Mock External Dependencies

```typescript
import { vi } from "vitest";
import { fetchUserData } from "./api";

vi.mock("./api", () => ({
  fetchUserData: vi.fn(() => Promise.resolve({ id: "1", name: "Test" })),
}));

it("should load user data", async () => {
  const data = await fetchUserData("1");
  expect(data.name).toBe("Test");
});
```

## Test Coverage Guidelines

### Minimum Coverage Targets

- **Business logic & utilities**: 80-90% coverage
- **Redux slices**: 80% coverage
- **Custom hooks**: 70% coverage
- **API integration**: 60% coverage
- **Components**: 40-60% coverage (focus on critical flows)

### Don't Chase 100% Coverage

- Coverage is a tool, not a goal
- 100% coverage doesn't guarantee bug-free code
- Focus on **meaningful tests** over coverage percentage

## Testing Workflow

### During Development (TDD Approach)

See `.opencode/knowledge/tdd-workflow.md` for complete TDD methodology.

**Quick TDD cycle**:

1. **RED**: Write a failing test first

   ```bash
   npm run test:watch  # Auto-runs on file save
   ```

2. **GREEN**: Implement minimum code to pass

3. **REFACTOR**: Clean up while keeping tests green

4. **VERIFY**: Run full checks

   ```bash
   npm run test:run && npm run type-check
   ```

**Example TDD in action** (from `project-code.ts`):

```typescript
// Step 1: Write failing test (RED)
it("should remove special characters throughout the string", () => {
  expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456"); // ❌ Fails
});

// Step 2: Fix implementation (GREEN)
export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  // Changed from /[^A-Z0-9-]+$/g to remove throughout, not just at end
};

// Step 3: Test passes ✅
```

### Progressive Verification Workflow

```bash
# During active development
npm run test:watch

# After feature increment
npm run test:run && npm run type-check

# Before committing
npm run verify

# E2E for critical flows
npm run test:e2e
```

### Before Committing

Run the full test suite:

```bash
npm run verify  # Runs test:run && type-check && build
```

### In CI/CD (Future)

```bash
npm run test:ci && npm run build
```

## Common Testing Scenarios

### Scenario 1: New Feature with Business Logic

**Example**: Adding a shopping cart with discount calculations

**Test Priority**:

1. ✅ Unit test discount calculation logic (`model/calculate-discount.test.ts`)
2. ✅ Test Redux slice for cart state (`tests/cart-slice.test.ts`)
3. ✅ Integration test for cart component (`tests/ShoppingCart.test.tsx`)
4. ⚠️ E2E test for checkout flow (if critical)

### Scenario 2: New CRUD Feature

**Example**: Admin user management

**Test Priority**:

1. ✅ Test API integration (`tests/users-api.test.ts`)
2. ✅ Test form validation logic (`model/validators.test.ts`)
3. ⚠️ Integration test for user table with filters
4. ❌ Skip testing simple list rendering

### Scenario 3: New Utility Function

**Example**: Date formatter

**Test Priority**:

1. ✅ Unit test with multiple cases (`utils/format-date.test.ts`)
2. ❌ No integration tests needed

### Scenario 4: Simple Presentational Page

**Example**: About Us page with static content

**Test Priority**:

1. ❌ No tests needed
2. Manual verification during development

## Migration Strategy

Since you're starting from zero tests, here's a **phased approach**:

### Phase 1: Infrastructure Setup (Week 1)

- [ ] Install testing dependencies (Vitest, Testing Library)
- [ ] Configure Vitest
- [ ] Create test utilities and helpers
- [ ] Set up CI/CD integration

### Phase 2: High-Value Tests (Weeks 2-3)

- [ ] Test authentication logic (login, logout, session)
- [ ] Test critical utilities (formatters, validators)
- [ ] Test Redux slices for core features

### Phase 3: Feature Tests (Weeks 4-6)

- [ ] Test API integration for main features
- [ ] Test custom hooks
- [ ] Test complex components

### Phase 4: Ongoing

- [ ] Write tests for new features as they're built
- [ ] Add tests when bugs are found
- [ ] Gradually increase coverage over time

## Decision Tree: Should I Write a Test?

```
Is it business-critical logic?
├─ YES → Write tests ✅
└─ NO
   └─ Does it break often?
      ├─ YES → Write tests ✅
      └─ NO
         └─ Is it complex with multiple branches?
            ├─ YES → Write tests ✅
            └─ NO
               └─ Is it a pure function?
                  ├─ YES → Consider testing ⚠️
                  └─ NO → Skip tests ❌
```

## Summary

**Golden Rules**:

1. **Test business value, not code coverage**
2. **Start with pure functions** - easiest to test, highest ROI
3. **Test what breaks** - if it's caused production bugs, test it
4. **Don't test the framework** - trust React, Redux, Ant Design
5. **Make tests readable** - they're documentation for future developers
6. **Keep tests fast** - slow tests won't be run
7. **Test behavior** - not implementation details
8. **Use TDD when appropriate** - See `.opencode/knowledge/tdd-workflow.md` for Red-Green-Refactor cycle

**Remember**: A few well-written tests for critical logic are better than hundreds of shallow tests that give false confidence.

## Related Documentation

- `.opencode/knowledge/tdd-workflow.md` - Complete TDD methodology with Red-Green-Refactor cycle and practical examples
- `.opencode/skills/testing-setup.md` - Vitest and Playwright configuration
- `.opencode/skills/testing-examples.md` - Practical testing patterns
- `.opencode/skills/playwright-e2e.md` - E2E testing with Playwright
- `AGENTS.md` - Repository-wide testing standards and non-negotiable rules
