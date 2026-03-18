# Testing Setup & Configuration

## Description

This skill guides you through setting up the complete testing infrastructure for this React + TypeScript + Vite project using Vitest and React Testing Library.

## Step 1: Install Testing Dependencies

Run the following command to install all necessary testing packages:

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Packages explanation**:
- `vitest` - Fast unit test framework (Vite-native, Jest-compatible)
- `@vitest/ui` - Web UI for viewing test results
- `jsdom` - DOM implementation for Node.js (simulates browser)
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - Simulate user interactions

## Step 2: Create Vitest Configuration

Create `vitest.config.ts` in the project root:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
        '.opencode/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Step 3: Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Step 4: Create Test Utilities

Create `src/test/utils/render-with-providers.tsx`:

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import authReducer from '@/features/auth/state/auth-slice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of the default render from @testing-library/react
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        // Add other reducers as needed
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
```

Create `src/test/utils/store-utils.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

/**
 * Helper to set up a Redux store for testing RTK Query APIs
 */
export function setupApiStore<A extends BaseQueryFn>(
  api: { reducerPath: string; reducer: any; middleware: any },
  extraReducers?: Record<string, any>
) {
  const getStore = () =>
    configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      },
      middleware: (gdm) => gdm().concat(api.middleware),
    });

  const initialStore = getStore();
  const refObj = {
    api,
    store: initialStore,
    refetch: () => {
      refObj.store = getStore();
    },
  };

  return refObj;
}
```

## Step 5: Create Test Mocks

Create `src/test/mocks/handlers.ts` (for future MSW integration):

```typescript
/**
 * Mock Service Worker handlers for API mocking
 * Add handlers here when you need to mock API responses in tests
 */

// Example:
// import { http, HttpResponse } from 'msw';
//
// export const handlers = [
//   http.get('/api/user', () => {
//     return HttpResponse.json({ id: '1', name: 'Test User' });
//   }),
// ];

export const handlers: any[] = [];
```

Create `src/test/mocks/redux-mock.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/state/auth-slice';
import type { RootState } from '@/app/store/store';

/**
 * Create a mock Redux store for testing
 */
export function createMockStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers as needed
    },
    preloadedState,
  });
}

/**
 * Mock authenticated session
 */
export const mockAuthSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  token: 'mock-token-123',
  role: 'user',
};

/**
 * Mock admin session
 */
export const mockAdminSession = {
  ...mockAuthSession,
  role: 'admin',
};
```

## Step 6: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "verify": "npm run test:run && npm run build"
  }
}
```

## Step 7: Update TypeScript Configuration

Add to `tsconfig.json` to recognize Vitest globals:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## Step 8: Create Example Test

Create `src/shared/utils/format-date.ts`:

```typescript
/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
```

Create `src/shared/utils/format-date.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('should format Date object correctly', () => {
    const date = new Date('2024-03-17');
    expect(formatDate(date)).toBe('March 17, 2024');
  });

  it('should format date string correctly', () => {
    expect(formatDate('2024-03-17')).toBe('March 17, 2024');
  });

  it('should handle different months', () => {
    expect(formatDate('2024-01-01')).toBe('January 1, 2024');
    expect(formatDate('2024-12-31')).toBe('December 31, 2024');
  });
});
```

## Step 9: Run Your First Test

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Folder Structure After Setup

```
src/
  test/
    mocks/
      handlers.ts
      redux-mock.ts
    utils/
      render-with-providers.tsx
      store-utils.ts
    setup.ts
  shared/
    utils/
      format-date.ts
      format-date.test.ts    ← Example test
  features/
    auth/
      tests/                 ← Feature tests go here
        auth-slice.test.ts
        validators.test.ts
vitest.config.ts             ← Root config
```

## Common Testing Patterns

### 1. Testing a Pure Function

```typescript
// src/shared/utils/calculate-total.ts
export function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal * (1 + taxRate);
}

// src/shared/utils/calculate-total.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculate-total';

describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    expect(calculateTotal(100, 0.08)).toBe(108);
  });

  it('should handle zero tax', () => {
    expect(calculateTotal(100, 0)).toBe(100);
  });
});
```

### 2. Testing a Redux Slice

```typescript
// src/features/auth/tests/auth-slice.test.ts
import { describe, it, expect } from 'vitest';
import authReducer, { login, logout } from '../state/auth-slice';

describe('auth slice', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      session: null,
    });
  });

  it('should handle login', () => {
    const session = {
      user: { id: '1', name: 'Test', email: 'test@example.com' },
      token: 'abc123',
      role: 'user',
    };

    const state = authReducer(undefined, login(session));
    expect(state.session).toEqual(session);
  });

  it('should handle logout', () => {
    const initialState = {
      session: {
        user: { id: '1', name: 'Test', email: 'test@example.com' },
        token: 'abc',
        role: 'user',
      },
    };

    const state = authReducer(initialState, logout());
    expect(state.session).toBeNull();
  });
});
```

### 3. Testing a Component

```typescript
// src/features/auth/tests/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils/render-with-providers';
import { LoginForm } from '../components/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
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
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### 4. Testing a Custom Hook

```typescript
// src/features/auth/tests/use-login.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useLogin } from '../hooks/use-login';
import authReducer from '../state/auth-slice';

describe('useLogin', () => {
  it('should initialize with correct default state', () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
    
    const { result } = renderHook(() => useLogin(), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

### 5. Testing RTK Query API

```typescript
// src/features/viewer/tests/viewer-api.test.ts
import { describe, it, expect } from 'vitest';
import { setupApiStore } from '@/test/utils/store-utils';
import { viewerApi } from '../api/viewer-api';

describe('viewerApi', () => {
  it('should fetch clinic services successfully', async () => {
    const storeRef = setupApiStore(viewerApi);
    
    const promise = storeRef.store.dispatch(
      viewerApi.endpoints.getClinicServices.initiate()
    );
    
    const { data, isSuccess } = await promise;
    
    expect(isSuccess).toBe(true);
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## Troubleshooting

### Issue: "Cannot find module '@/...'"

**Solution**: Ensure `vitest.config.ts` has the correct path alias:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue: "ReferenceError: describe is not defined"

**Solution**: Add `globals: true` to `vitest.config.ts`:

```typescript
test: {
  globals: true,
}
```

### Issue: "document is not defined"

**Solution**: Set the test environment to jsdom:

```typescript
test: {
  environment: 'jsdom',
}
```

### Issue: Tests pass locally but fail in CI

**Solution**: Use `npm run test:run` in CI instead of `npm test` to ensure tests run once and exit.

## Next Steps

1. **Run the setup**: Follow steps 1-9 to install and configure everything
2. **Write your first test**: Create a simple utility function and test it
3. **Add feature tests**: Focus on critical business logic first
4. **Set up CI**: Integrate `npm run verify` into your GitHub Actions or CI pipeline
5. **Monitor coverage**: Use `npm run test:coverage` to track progress

## Best Practices

- ✅ Keep test files close to what they test (colocated or in `tests/` folder)
- ✅ Use `describe` blocks to group related tests
- ✅ Use descriptive test names that explain the expected behavior
- ✅ Mock external dependencies (APIs, third-party services)
- ✅ Test edge cases and error states
- ❌ Don't test implementation details
- ❌ Don't make tests depend on each other
- ❌ Don't test third-party libraries

## Summary

After completing this setup, you'll have:

- ✅ Vitest configured and ready to use
- ✅ React Testing Library for component tests
- ✅ Test utilities for rendering with providers
- ✅ Mock helpers for Redux and APIs
- ✅ Coverage reporting configured
- ✅ Scripts for running tests in different modes

You're now ready to start writing tests! Refer to `.opencode/knowledge/testing-strategy.md` for guidance on **when** and **what** to test.
