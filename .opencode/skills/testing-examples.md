# Testing Examples & Patterns

## Description

Real-world testing examples for common scenarios in this project. Copy and adapt these patterns for your features.

---

## Example 1: Testing a Utility Function

**Scenario**: You created a currency formatter utility.

### Implementation

```typescript
// src/shared/utils/format-currency.ts
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### Test

```typescript
// src/shared/utils/format-currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('should format positive amounts with USD', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative amounts', () => {
    expect(formatCurrency(-99.99)).toBe('-$99.99');
  });

  it('should handle different currencies', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(1.999)).toBe('$2.00');
  });
});
```

**Key Points**:
- ✅ Test multiple cases (positive, zero, negative)
- ✅ Test edge cases (rounding)
- ✅ Test optional parameters
- ✅ Keep tests simple and focused

---

## Example 2: Testing a Redux Slice

**Scenario**: You have an auth slice that manages user session.

### Implementation

```typescript
// src/features/auth/state/auth-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthSession } from '../types';

interface AuthState {
  session: AuthSession | null;
}

const initialState: AuthState = {
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
    },
    logout(state) {
      state.session = null;
    },
    updateUser(state, action: PayloadAction<Partial<AuthSession['user']>>) {
      if (state.session) {
        state.session.user = { ...state.session.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

### Test

```typescript
// src/features/auth/tests/auth-slice.test.ts
import { describe, it, expect } from 'vitest';
import authReducer, { login, logout, updateUser } from '../state/auth-slice';
import type { AuthState } from '../state/auth-slice';

describe('auth slice', () => {
  const mockSession = {
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    token: 'abc123',
    role: 'user' as const,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      session: null,
    });
  });

  describe('login', () => {
    it('should set session on login', () => {
      const state = authReducer(undefined, login(mockSession));
      expect(state.session).toEqual(mockSession);
    });
  });

  describe('logout', () => {
    it('should clear session on logout', () => {
      const initialState = { session: mockSession };
      const state = authReducer(initialState, logout());
      expect(state.session).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data when session exists', () => {
      const initialState = { session: mockSession };
      const state = authReducer(initialState, updateUser({ name: 'Jane Doe' }));
      
      expect(state.session?.user.name).toBe('Jane Doe');
      expect(state.session?.user.email).toBe('john@example.com'); // Unchanged
    });

    it('should not crash when session is null', () => {
      const initialState = { session: null };
      const state = authReducer(initialState, updateUser({ name: 'Jane' }));
      expect(state.session).toBeNull();
    });
  });
});
```

**Key Points**:
- ✅ Test initial state
- ✅ Test each action/reducer
- ✅ Group related tests with `describe`
- ✅ Test edge cases (null session)
- ✅ Use mock data for consistency

---

## Example 3: Testing RTK Query API

**Scenario**: You have an API for fetching clinic services.

### Implementation

```typescript
// src/features/viewer/api/viewer-api.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { allClinicServices } from '@/resources/mock-data/all-clinic-services';
import type { ClinicService } from '../types';

export const viewerApi = createApi({
  reducerPath: 'viewerApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getClinicServices: builder.query<ClinicService[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        return { data: allClinicServices };
      },
    }),
  }),
});

export const { useGetClinicServicesQuery } = viewerApi;
```

### Test

```typescript
// src/features/viewer/tests/viewer-api.test.ts
import { describe, it, expect } from 'vitest';
import { setupApiStore } from '@/test/utils/store-utils';
import { viewerApi } from '../api/viewer-api';

describe('viewerApi', () => {
  describe('getClinicServices', () => {
    it('should fetch clinic services successfully', async () => {
      const storeRef = setupApiStore(viewerApi);

      const promise = storeRef.store.dispatch(
        viewerApi.endpoints.getClinicServices.initiate()
      );

      const result = await promise;

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('should return data with correct structure', async () => {
      const storeRef = setupApiStore(viewerApi);

      const promise = storeRef.store.dispatch(
        viewerApi.endpoints.getClinicServices.initiate()
      );

      const result = await promise;
      const service = result.data![0];

      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
    });
  });
});
```

**Key Points**:
- ✅ Use `setupApiStore` helper for RTK Query tests
- ✅ Test successful data fetching
- ✅ Verify data structure
- ✅ Test async behavior

---

## Example 4: Testing a Validator Function

**Scenario**: You have password validation logic.

### Implementation

```typescript
// src/features/auth/model/validators.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Test

```typescript
// src/features/auth/tests/validators.test.ts
import { describe, it, expect } from 'vitest';
import { validatePassword } from '../model/validators';

describe('validatePassword', () => {
  it('should pass for valid password', () => {
    const result = validatePassword('ValidPass123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail for short password', () => {
    const result = validatePassword('Short1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('should fail for password without uppercase', () => {
    const result = validatePassword('lowercase123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should fail for password without lowercase', () => {
    const result = validatePassword('UPPERCASE123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should fail for password without number', () => {
    const result = validatePassword('NoNumbers');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should return multiple errors for invalid password', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
```

**Key Points**:
- ✅ Test valid case first
- ✅ Test each validation rule separately
- ✅ Test multiple errors scenario
- ✅ Verify both `isValid` and `errors` array

---

## Example 5: Testing a React Component

**Scenario**: You have a login form component.

### Implementation

```typescript
// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await onSubmit?.(values);
      message.success('Login successful!');
    } catch (error) {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleFinish} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Email is required' }]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password is required' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
```

### Test

```typescript
// src/features/auth/tests/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils/render-with-providers';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm', () => {
  it('should render form fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should disable submit button while loading', async () => {
    const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Button should be disabled while loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
```

**Key Points**:
- ✅ Test rendering of elements
- ✅ Test validation behavior
- ✅ Test form submission
- ✅ Test loading states
- ✅ Use `vi.fn()` to mock callbacks
- ✅ Use `waitFor` for async assertions
- ✅ Use `render` from test utils (includes providers)

---

## Example 6: Testing a Custom Hook

**Scenario**: You have a custom hook for managing form state.

### Implementation

```typescript
// src/features/auth/hooks/use-login-form.ts
import { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { login } from '../state/auth-slice';

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email === 'test@example.com' && password === 'password123') {
        dispatch(login({
          user: { id: '1', name: 'Test User', email },
          token: 'mock-token',
          role: 'user',
        }));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
  };
}
```

### Test

```typescript
// src/features/auth/tests/use-login-form.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useLoginForm } from '../hooks/use-login-form';
import authReducer from '../state/auth-slice';

describe('useLoginForm', () => {
  function createWrapper() {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  }

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: createWrapper(),
    });

    result.current.handleLogin('test@example.com', 'password123');

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for login to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle failed login', async () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: createWrapper(),
    });

    result.current.handleLogin('wrong@example.com', 'wrongpass');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Invalid credentials');
  });
});
```

**Key Points**:
- ✅ Use `renderHook` from React Testing Library
- ✅ Wrap hook with necessary providers
- ✅ Test initial state
- ✅ Test success and error cases
- ✅ Use `waitFor` for async operations

---

## Common Testing Patterns

### Pattern 1: Mocking Functions

```typescript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock with return value
const mockFn = vi.fn(() => 'return value');

// Mock with promise
const mockFn = vi.fn(() => Promise.resolve({ data: 'test' }));

// Assert call count
expect(mockFn).toHaveBeenCalledTimes(1);

// Assert called with arguments
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

### Pattern 2: Mocking Modules

```typescript
// Mock entire module
vi.mock('../api/auth-api', () => ({
  loginUser: vi.fn(() => Promise.resolve({ token: 'abc' })),
}));

// Mock specific export
vi.mock('../utils', () => ({
  ...vi.importActual('../utils'),
  formatDate: vi.fn(() => '2024-03-17'),
}));
```

### Pattern 3: Testing Async Code

```typescript
// Using async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Using waitFor
it('should update state', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Pattern 4: Testing Error States

```typescript
it('should handle error', async () => {
  const mockFn = vi.fn(() => Promise.reject(new Error('Failed')));
  
  render(<Component onFetch={mockFn} />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## Summary

**Key Takeaways**:

1. **Keep tests simple** - Test one thing at a time
2. **Use descriptive names** - Test name should explain what it tests
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Mock dependencies** - Isolate the code under test
5. **Test behavior** - Not implementation details
6. **Test edge cases** - Empty values, null, errors
7. **Use helpers** - `renderWithProviders`, `setupApiStore`

**Next Steps**:

1. Copy these patterns to your features
2. Start with simple utility function tests
3. Progress to Redux slices and hooks
4. Add component tests for critical flows

Refer to `.opencode/knowledge/testing-strategy.md` for guidance on **when** to write tests.
