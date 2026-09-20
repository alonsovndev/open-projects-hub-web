import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Forgot Password Flow", () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test("should request a reset code and land on the reset-password step", async ({ page }) => {
    // The backend always returns the same generic response regardless of
    // whether the email exists (FR-009-01), so this only verifies the
    // request/redirect UX — not real code delivery, which needs a test
    // mailbox this repo doesn't have yet.
    await forgotPasswordPage.requestReset(testUsers.admin.email);

    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByText(/reset code sent/i)).toBeVisible();
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
