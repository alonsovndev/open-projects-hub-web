import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Login Flow", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should show error with invalid credentials", async () => {
    await loginPage.login("invalid@test.com", "wrongpassword");
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should show validation error for empty email", async () => {
    await loginPage.login("", testUsers.admin.password);
    await expect(loginPage.emailInput).toHaveAttribute("aria-invalid", "true");
  });

  test("should show validation error for empty password", async () => {
    await loginPage.login(testUsers.admin.email, "");
    await expect(loginPage.passwordInput).toHaveAttribute("aria-invalid", "true");
  });

  test("should navigate to forgot password", async ({ page }) => {
    await page.getByRole("link", { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("should navigate to register", async ({ page }) => {
    await page.getByRole("link", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("should remember me checkbox be functional", async ({ page }) => {
    const rememberCheckbox = page.getByRole("checkbox", { name: /remember me/i });
    await expect(rememberCheckbox).not.toBeChecked();
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();
  });
});
