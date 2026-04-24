# Testing Setup & Configuration

## Description

This skill guides you through setting up the complete testing infrastructure for this React + TypeScript + Vite project using:

- **Vitest** - Unit and integration tests
- **React Testing Library** - Component testing
- **Playwright** - End-to-end (E2E) tests

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
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "dist/",
        ".opencode/",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## Step 3: Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

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
import { configureStore } from "@reduxjs/toolkit";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

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
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/auth-slice";
import type { RootState } from "@/app/store/store";

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
    id: "1",
    email: "test@example.com",
    name: "Test User",
  },
  token: "mock-token-123",
  role: "user",
};

/**
 * Mock admin session
 */
export const mockAdminSession = {
  ...mockAuthSession,
  role: "admin",
};
```

## Step 6: Install Playwright for E2E Testing

Run the following command to install Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

**What gets installed**:

- `@playwright/test` - Playwright test runner
- Browser binaries (Chromium, Firefox, WebKit) - Installed by `npx playwright install`

## Step 7: Create Playwright Configuration

Create `playwright.config.ts` in the project root:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Step 8: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "verify": "npm run test:run && npm run test:e2e && npm run build"
  }
}
```

## Step 9: Create E2E Test Structure

Create the E2E directory structure:

```bash
mkdir -p e2e/fixtures
mkdir -p e2e/pages
```

Create `e2e/fixtures/test-users.ts`:

```typescript
/**
 * Test user credentials for E2E tests
 * These should match your test database or mock API
 */
export const testUsers = {
  admin: {
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
  user: {
    email: "user@test.com",
    password: "user123",
    role: "user",
  },
};
```

Create `e2e/pages/LoginPage.ts` (Page Object Model):

```typescript
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole("button", { name: /login/i });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string) {
    await this.errorMessage.waitFor({ state: "visible" });
    await expect(this.errorMessage).toContainText(message);
  }
}
```

Create `e2e/auth.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Authentication", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(testUsers.user.email, testUsers.user.password);

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("wrong@email.com", "wrongpassword");

    await loginPage.expectErrorMessage("Invalid credentials");
  });

  test("should logout successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.user.email, testUsers.user.password);

    // Click logout button
    await page.getByRole("button", { name: /logout/i }).click();

    // Should redirect to home
    await expect(page).toHaveURL("/");
  });
});
```

## Step 10: Update TypeScript Configuration

Add to `tsconfig.json` to recognize Vitest globals:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

Create `tsconfig.e2e.json` for E2E tests:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["@playwright/test"]
  },
  "include": ["e2e/**/*"]
}
```

## Step 11: Create Example Unit Test

Create `src/shared/utils/format-date.ts`:

```typescript
/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
```

Create `src/shared/utils/format-date.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("should format Date object correctly", () => {
    const date = new Date("2024-03-17");
    expect(formatDate(date)).toBe("March 17, 2024");
  });

  it("should format date string correctly", () => {
    expect(formatDate("2024-03-17")).toBe("March 17, 2024");
  });

  it("should handle different months", () => {
    expect(formatDate("2024-01-01")).toBe("January 1, 2024");
    expect(formatDate("2024-12-31")).toBe("December 31, 2024");
  });
});
```

## Step 12: Run Your Tests

### Unit Tests (Vitest)

```bash
# Run unit tests once
npm run test:run

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# View E2E test report
npm run test:e2e:report
```

### Full Verification

```bash
# Run all tests + build
npm run verify
```

```

## Step 13: Folder Structure After Setup

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
format-date.test.ts ← Unit test example
features/
auth/
tests/ ← Feature unit tests
auth-slice.test.ts
validators.test.ts
e2e/ ← E2E tests directory
fixtures/
test-users.ts ← Test data
pages/
LoginPage.ts ← Page Object Model
auth.spec.ts ← E2E test suite
vitest.config.ts ← Vitest config
playwright.config.ts ← Playwright config
tsconfig.e2e.json ← E2E TypeScript config

```

```

## Common Testing Patterns

### 1. Testing a Pure Function

```typescript
// src/shared/utils/calculate-total.ts
export function calculateTotal(subtotal: number, taxRate: number): number {
  return subtotal * (1 + taxRate);
}

// src/shared/utils/calculate-total.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculate-total";

describe("calculateTotal", () => {
  it("should calculate total with tax", () => {
    expect(calculateTotal(100, 0.08)).toBe(108);
  });

  it("should handle zero tax", () => {
    expect(calculateTotal(100, 0)).toBe(100);
  });
});
```

### 2. Testing a Redux Slice

```typescript
// src/features/auth/tests/auth-slice.test.ts
import { describe, it, expect } from "vitest";
import authReducer, { login, logout } from "../state/auth-slice";

describe("auth slice", () => {
  it("should return initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual({
      session: null,
    });
  });

  it("should handle login", () => {
    const session = {
      user: { id: "1", name: "Test", email: "test@example.com" },
      token: "abc123",
      role: "user",
    };

    const state = authReducer(undefined, login(session));
    expect(state.session).toEqual(session);
  });

  it("should handle logout", () => {
    const initialState = {
      session: {
        user: { id: "1", name: "Test", email: "test@example.com" },
        token: "abc",
        role: "user",
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
import { describe, it, expect } from "vitest";
import { setupApiStore } from "@/test/utils/store-utils";
import { viewerApi } from "../api/viewer-api";

describe("viewerApi", () => {
  it("should fetch clinic services successfully", async () => {
    const storeRef = setupApiStore(viewerApi);

    const promise = storeRef.store.dispatch(viewerApi.endpoints.getClinicServices.initiate());

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
