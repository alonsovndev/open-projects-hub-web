import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Forgot Password Flow", () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test("should successfully request password reset", async ({ page }) => {
    await forgotPasswordPage.requestReset(testUsers.admin.email);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/reset link sent/i)).toBeVisible();
  });

  test("should show validation for invalid email", async () => {
    await forgotPasswordPage.emailInput.fill("invalid-email");
    await forgotPasswordPage.submitButton.click();

    await expect(forgotPasswordPage.emailInput).toHaveAttribute("aria-invalid", "true");
  });

  test("should navigate back to login", async ({ page }) => {
    await forgotPasswordPage.backToSignInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
