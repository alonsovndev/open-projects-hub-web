import { test, expect } from "@playwright/test";
import { RegisterPage } from "./pages/RegisterPage";

test.describe("Register Flow", () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test("should successfully register with valid data", async ({ page }) => {
    const timestamp = Date.now();
    await registerPage.register("Test User", `testuser${timestamp}@test.com`, "Test123!@#");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/account created successfully/i)).toBeVisible();
  });

  test("should show validation for weak password", async () => {
    await registerPage.fullNameInput.fill("Test User");
    await registerPage.emailInput.fill("test@test.com");
    await registerPage.passwordInput.fill("weak");
    await registerPage.confirmPasswordInput.fill("weak");
    await registerPage.termsCheckbox.check();
    await registerPage.submitButton.click();

    await expect(registerPage.page.getByText(/password must meet all/i)).toBeVisible();
  });

  test("should show validation for password mismatch", async () => {
    await registerPage.fullNameInput.fill("Test User");
    await registerPage.emailInput.fill("test@test.com");
    await registerPage.passwordInput.fill("Test123!@#");
    await registerPage.confirmPasswordInput.fill("Different123!@#");
    await registerPage.termsCheckbox.check();
    await registerPage.submitButton.click();

    await expect(registerPage.page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("should require terms acceptance", async () => {
    await registerPage.fullNameInput.fill("Test User");
    await registerPage.emailInput.fill("test@test.com");
    await registerPage.passwordInput.fill("Test123!@#");
    await registerPage.confirmPasswordInput.fill("Test123!@#");
    await registerPage.submitButton.click();

    await expect(registerPage.page.getByText(/must agree/i)).toBeVisible();
  });

  test("should navigate to login", async ({ page }) => {
    await registerPage.signInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
