# Testing Strategy

## Philosophy

This project follows a **pragmatic testing approach** that balances quality with velocity:

1. **Write tests for business-critical logic** - Focus on features that handle money, authentication, authorization, data validation, and user workflows
2. **Don't test implementation details** - Test behavior and outcomes, not internal structure
3. **Test what breaks often** - If a feature has bugs in production repeatedly, add tests
4. **Skip tests for simple UI** - Don't test purely presentational components with no logic
5. **Test complex logic separately** - Extract and test pure functions, validators, transformers, and calculators

## Testing Pyramid

```
           ╔═══════════════╗
           ║   E2E Tests   ║  ← Few, slow, expensive (critical user flows)
           ║   (Optional)  ║
           ╚═══════════════╝
        ╔═════════════════════╗
        ║ Integration Tests   ║  ← Some (feature workflows)
        ╚═════════════════════╝
   ╔══════════════════════════════╗
   ║      Unit Tests              ║  ← Many, fast, cheap (logic & utilities)
   ╚══════════════════════════════╝
```

## When to Write Tests

### ✅ ALWAYS Test

1. **Authentication & Authorization Logic**
   - Login/logout flows
   - Session management
   - Role-based access checks
   - Token validation

2. **Business Logic & Calculations**
   - Price calculations
   - Discount/tax logic
   - Data transformations
   - Validation rules

3. **Data Mutations**
   - Form submissions
   - API mutations (create, update, delete)
   - State updates with side effects

4. **Utility Functions**
   - Date formatters
   - Currency formatters
   - Validators
   - Parsers

5. **Custom Hooks with Logic**
   - Hooks that orchestrate multiple operations
   - Hooks with complex state management
   - Hooks with side effects

### ⚠️ CONSIDER Testing

1. **Complex UI Components**
   - Multi-step forms
   - Interactive data tables with filters
   - Search components with debounce
   - Wizards and multi-page flows

2. **Feature Workflows**
   - User registration
   - Checkout flows
   - Admin CRUD operations

3. **Error Handling**
   - API error responses
   - Validation error display
   - Fallback UI rendering

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// src/shared/utils/format-currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-99.99)).toBe('-$99.99');
  });
});
```

### 2. Redux Slices & State Logic

**Where**: `src/features/<feature>/tests/`

**Test**: Actions, reducers, selectors

**Example**:
```typescript
// src/features/auth/tests/auth-slice.test.ts
import { describe, it, expect } from 'vitest';
import authReducer, { login, logout } from '../state/auth-slice';

describe('auth slice', () => {
  it('should handle login', () => {
    const state = authReducer(undefined, login({
      user: { id: '1', name: 'Test User' },
      token: 'abc123'
    }));
    
    expect(state.session).toBeDefined();
    expect(state.session?.user.name).toBe('Test User');
  });

  it('should handle logout', () => {
    const initialState = {
      session: { user: { id: '1', name: 'Test' }, token: 'abc' }
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
import { renderHook, waitFor } from '@testing-library/react';
import { useLogin } from '../hooks/use-login';

describe('useLogin', () => {
  it('should handle successful login', async () => {
    const { result } = renderHook(() => useLogin());
    
    result.current.handleLogin('user@example.com', 'password123');
    
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
import { describe, it, expect } from 'vitest';
import { setupApiStore } from '@/test/utils/store-utils';
import { viewerApi } from '../api/viewer-api';

describe('viewerApi', () => {
  it('should fetch clinic services', async () => {
    const storeRef = setupApiStore(viewerApi);
    
    const promise = storeRef.store.dispatch(
      viewerApi.endpoints.getClinicServices.initiate()
    );
    
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
it('should call setState with updated value', () => {
  const { result } = renderHook(() => useCounter());
  const setStateSpy = vi.spyOn(result.current, 'setState');
  result.current.increment();
  expect(setStateSpy).toHaveBeenCalled();
});
```

✅ **Good** (testing behavior):
```typescript
it('should increment counter when increment is called', () => {
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
it('should calculate total with tax', () => {
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

it('should create user', () => {
  user = createUser('John');
  expect(user).toBeDefined();
});

it('should update user', () => {
  user.name = 'Jane'; // Depends on previous test!
  expect(user.name).toBe('Jane');
});
```

✅ **Good** (independent tests):
```typescript
it('should create user', () => {
  const user = createUser('John');
  expect(user).toBeDefined();
});

it('should update user', () => {
  const user = createUser('John');
  user.name = 'Jane';
  expect(user.name).toBe('Jane');
});
```

### 5. Mock External Dependencies

```typescript
import { vi } from 'vitest';
import { fetchUserData } from './api';

vi.mock('./api', () => ({
  fetchUserData: vi.fn(() => Promise.resolve({ id: '1', name: 'Test' }))
}));

it('should load user data', async () => {
  const data = await fetchUserData('1');
  expect(data.name).toBe('Test');
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

### During Development

1. **Write the test first** (when TDD applies):
   ```bash
   # Run tests in watch mode
   npm run test:watch
   ```

2. **See it fail** - Confirm the test fails for the right reason

3. **Implement minimum code** to make it pass

4. **Refactor** while keeping tests green

### Before Committing

Run the full test suite:
```bash
npm run test && npm run build
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

**Remember**: A few well-written tests for critical logic are better than hundreds of shallow tests that give false confidence.
