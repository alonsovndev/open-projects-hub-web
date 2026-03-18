# Playwright E2E Testing

## Description

This skill provides patterns and best practices for writing end-to-end (E2E) tests using Playwright for this React application.

---

## When to Write E2E Tests

### ✅ ALWAYS Write E2E Tests For

1. **Critical User Journeys**
   - User registration and login flow
   - Checkout and payment process
   - Password reset workflow
   - Multi-step forms

2. **High-Value Features**
   - Features that generate revenue
   - Features used by all users
   - Features that involve external services

3. **Cross-System Integrations**
   - API integrations
   - Third-party service integrations
   - Payment gateway integration

### ⚠️ CONSIDER E2E Tests For

1. **Complex Interactions**
   - Drag-and-drop functionality
   - File uploads
   - Real-time features (chat, notifications)

2. **Browser-Specific Behavior**
   - Features that behave differently across browsers
   - Mobile-specific features

### ❌ DON'T Write E2E Tests For

1. **Unit-Level Logic** - Use Vitest instead
2. **Component Rendering** - Use React Testing Library instead
3. **Every UI Element** - E2E tests are expensive; focus on critical flows

---

## E2E Test Structure

### Project Structure

```
e2e/
  fixtures/          # Test data and configuration
    test-users.ts
    test-data.ts
  pages/             # Page Object Models (POM)
    LoginPage.ts
    DashboardPage.ts
    CheckoutPage.ts
  helpers/           # Reusable helper functions
    auth-helpers.ts
    api-helpers.ts
  *.spec.ts          # Test files
```

### Test File Naming

- Use `.spec.ts` suffix for E2E tests
- Name tests after the feature: `auth.spec.ts`, `checkout.spec.ts`
- Group related tests in the same file

---

## Page Object Model (POM) Pattern

### Why Use POM?

1. **Maintainability** - Locators defined in one place
2. **Reusability** - Share page logic across tests
3. **Readability** - Tests read like user stories

### POM Example

```typescript
// e2e/pages/LoginPage.ts
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

  async expectSuccess() {
    // Wait for redirect to dashboard
    await this.page.waitForURL("/dashboard");
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Using POM in Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("should login successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("user@test.com", "password123");
  await loginPage.expectSuccess();
});
```

---

## Common E2E Testing Patterns

### 1. Authentication Flow

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Authentication", () => {
  test("should login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.user.email, testUsers.user.password);

    // Verify redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("wrong@email.com", "wrongpass");

    await loginPage.expectError("Invalid credentials");
    // Should stay on login page
    await expect(page).toHaveURL("/login");
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.user.email, testUsers.user.password);

    // Logout
    await page.getByRole("button", { name: /logout/i }).click();

    // Verify redirect to home
    await expect(page).toHaveURL("/");
  });
});
```

### 2. Form Submission

```typescript
// e2e/contact.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("should submit contact form successfully", async ({ page }) => {
    await page.goto("/contact");

    // Fill form
    await page.getByLabel(/name/i).fill("John Doe");
    await page.getByLabel(/email/i).fill("john@example.com");
    await page.getByLabel(/message/i).fill("This is a test message");

    // Submit
    await page.getByRole("button", { name: /submit/i }).click();

    // Verify success message
    await expect(page.getByText(/message sent successfully/i)).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/contact");

    // Submit without filling
    await page.getByRole("button", { name: /submit/i }).click();

    // Verify errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });
});
```

### 3. Navigation Testing

```typescript
// e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto("/");

    // Click About link
    await page.getByRole("link", { name: /about/i }).click();
    await expect(page).toHaveURL("/about");

    // Click Services link
    await page.getByRole("link", { name: /services/i }).click();
    await expect(page).toHaveURL("/services");

    // Click Contact link
    await page.getByRole("link", { name: /contact/i }).click();
    await expect(page).toHaveURL("/contact");
  });

  test("should handle breadcrumb navigation", async ({ page }) => {
    await page.goto("/dashboard/settings/profile");

    // Click breadcrumb
    await page.getByRole("link", { name: /dashboard/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### 4. Search and Filtering

```typescript
// e2e/search.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("should search and display results", async ({ page }) => {
    await page.goto("/services");

    // Type in search
    await page.getByPlaceholder(/search/i).fill("therapy");
    await page.getByPlaceholder(/search/i).press("Enter");

    // Wait for results
    await page.waitForSelector('[data-testid="service-card"]');

    // Verify results contain search term
    const results = page.getByTestId("service-card");
    await expect(results.first()).toContainText(/therapy/i);
  });

  test("should filter by category", async ({ page }) => {
    await page.goto("/services");

    // Select category filter
    await page.getByLabel(/category/i).selectOption("mental-health");

    // Verify filtered results
    const results = page.getByTestId("service-card");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });
});
```

### 5. Role-Based Access

```typescript
// e2e/admin.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Admin Access", () => {
  test("admin should access admin panel", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);

    // Navigate to admin panel
    await page.goto("/admin");
    await expect(page.getByText(/admin dashboard/i)).toBeVisible();
  });

  test("regular user should not access admin panel", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.user.email, testUsers.user.password);

    // Try to access admin panel
    await page.goto("/admin");

    // Should redirect to unauthorized
    await expect(page).toHaveURL("/unauthorized");
  });
});
```

### 6. Multi-Step Workflows

```typescript
// e2e/registration.spec.ts
import { test, expect } from "@playwright/test";

test.describe("User Registration", () => {
  test("should complete registration workflow", async ({ page }) => {
    await page.goto("/register");

    // Step 1: Basic Info
    await page.getByLabel(/email/i).fill("newuser@test.com");
    await page.getByLabel(/password/i).fill("SecurePass123!");
    await page.getByLabel(/confirm password/i).fill("SecurePass123!");
    await page.getByRole("button", { name: /next/i }).click();

    // Step 2: Profile Info
    await page.getByLabel(/first name/i).fill("John");
    await page.getByLabel(/last name/i).fill("Doe");
    await page.getByLabel(/phone/i).fill("555-1234");
    await page.getByRole("button", { name: /next/i }).click();

    // Step 3: Preferences
    await page.getByLabel(/newsletter/i).check();
    await page.getByRole("button", { name: /complete/i }).click();

    // Verify success
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText(/welcome, john/i)).toBeVisible();
  });
});
```

---

## Fixtures and Test Data

### Creating Test Users

```typescript
// e2e/fixtures/test-users.ts
export const testUsers = {
  admin: {
    email: "admin@test.com",
    password: "Admin123!",
    role: "admin",
  },
  user: {
    email: "user@test.com",
    password: "User123!",
    role: "user",
  },
  guest: {
    email: "guest@test.com",
    password: "Guest123!",
    role: "guest",
  },
};
```

### Creating Test Data

```typescript
// e2e/fixtures/test-data.ts
export const testServices = [
  {
    id: "service-1",
    name: "Mental Health Therapy",
    category: "mental-health",
    price: 120,
  },
  {
    id: "service-2",
    name: "Physical Therapy",
    category: "physical-health",
    price: 80,
  },
];

export const testAppointment = {
  serviceId: "service-1",
  date: "2024-03-20",
  time: "14:00",
  notes: "First appointment",
};
```

---

## Helper Functions

### Authentication Helper

```typescript
// e2e/helpers/auth-helpers.ts
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/test-users";

export async function loginAsUser(page: Page, role: "admin" | "user" = "user") {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUsers[role].email, testUsers[role].password);
  await page.waitForURL("/dashboard");
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: /logout/i }).click();
  await page.waitForURL("/");
}
```

### API Helper

```typescript
// e2e/helpers/api-helpers.ts
import { APIRequestContext } from "@playwright/test";

export async function createTestUser(request: APIRequestContext, email: string) {
  return await request.post("/api/users", {
    data: {
      email,
      password: "Test123!",
      name: "Test User",
    },
  });
}

export async function deleteTestUser(request: APIRequestContext, userId: string) {
  return await request.delete(`/api/users/${userId}`);
}
```

---

## Best Practices

### 1. Use Semantic Locators

✅ **Good** (Semantic):

```typescript
page.getByRole("button", { name: /submit/i });
page.getByLabel(/email/i);
page.getByText(/welcome/i);
page.getByPlaceholder(/search/i);
```

❌ **Bad** (Fragile):

```typescript
page.locator(".submit-btn");
page.locator("#email-input");
page.locator("div > span > button");
```

### 2. Wait for Elements Properly

✅ **Good**:

```typescript
await page.waitForURL("/dashboard");
await expect(page.getByText(/welcome/i)).toBeVisible();
await page.waitForLoadState("networkidle");
```

❌ **Bad**:

```typescript
await page.waitForTimeout(3000); // Arbitrary wait
```

### 3. Use Test Isolation

```typescript
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto("/");
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
  await logout(page);
});
```

### 4. Group Related Tests

```typescript
test.describe("User Profile", () => {
  test.describe("View Profile", () => {
    // Tests for viewing profile
  });

  test.describe("Edit Profile", () => {
    // Tests for editing profile
  });
});
```

### 5. Use Data-Testid for Complex Elements

Add `data-testid` attributes to complex elements:

```tsx
// In React component
<div data-testid="service-card">
  <h3>{service.name}</h3>
  <p>{service.description}</p>
</div>
```

```typescript
// In E2E test
await page.getByTestId("service-card").click();
```

### 6. Handle Network Requests

```typescript
// Wait for API call
await page.waitForResponse(
  (response) => response.url().includes("/api/services") && response.status() === 200
);

// Mock API response
await page.route("/api/services", (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: "1", name: "Test Service" }]),
  });
});
```

---

## Advanced Patterns

### 1. Authentication State Reuse

```typescript
// e2e/auth.setup.ts
import { test as setup } from "@playwright/test";
import { loginAsUser } from "./helpers/auth-helpers";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await loginAsUser(page, "user");
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
});
```

### 2. Visual Regression Testing

```typescript
test("should match screenshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage.png");
});
```

### 3. Mobile Testing

```typescript
test("should work on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  // Mobile-specific interactions
  await page.getByRole("button", { name: /menu/i }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
});
```

---

## Debugging E2E Tests

### 1. Run with UI Mode

```bash
npm run test:e2e:ui
```

### 2. Run with Debug Mode

```bash
npm run test:e2e:debug
```

### 3. Use `page.pause()`

```typescript
test("debug test", async ({ page }) => {
  await page.goto("/login");
  await page.pause(); // Execution pauses here
  await page.getByLabel(/email/i).fill("test@example.com");
});
```

### 4. Take Screenshots on Failure

```typescript
test("should login", async ({ page }) => {
  try {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("test@example.com");
  } catch (error) {
    await page.screenshot({ path: "failure.png" });
    throw error;
  }
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Summary

**Use E2E tests for**:

- ✅ Critical user journeys
- ✅ Multi-step workflows
- ✅ Cross-system integrations
- ✅ Browser-specific behavior

**Best Practices**:

1. Use Page Object Model pattern
2. Use semantic locators
3. Wait for elements properly
4. Isolate tests
5. Reuse authentication state
6. Use helpers and fixtures

**Remember**: E2E tests are expensive - focus on critical flows and supplement with unit/integration tests for comprehensive coverage.
