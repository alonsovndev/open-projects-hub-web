import { test, expect } from "@playwright/test";
import { RegisterPage } from "./pages/RegisterPage";

test.describe("Register Flow", () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test("should send a new account to email verification", async ({ page }) => {
    // Mocked: the real endpoint creates a new workspace for the account and emails a code.
    await page.route("**/v1/auth/register", (route) =>
      route.fulfill({
        status: 201,
        json: {
          email: "te***@test.com",
          verificationRequired: true,
          nextStep: "verify-email",
          codeExpiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
        },
      })
    );

    await registerPage.register("Test User", "testuser@test.com", "Test123!@#");

    await expect(page).toHaveURL(/\/verify-email/);
    await expect(page.getByText("testuser@test.com")).toBeVisible();
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
