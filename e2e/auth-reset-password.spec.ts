import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

const GENERIC_MESSAGE = "If an account exists for this email, a reset code has been sent.";

test.describe("Reset Password Flow", () => {
  test("should prompt to start from Forgot Password when no email context is present", async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.goto();

    await expect(page.getByText(/start from forgot password/i)).toBeVisible();
    await expect(resetPasswordPage.submitButton).toBeDisabled();
  });

  test.describe("after requesting a code", () => {
    // The reset-password form is only enabled with an email carried via
    // router state from the Forgot Password step (same-session flow — see
    // use-reset-password-form.ts), so every spec here goes through it first.
    // The API is mocked so these don't depend on a real mailbox or backend
    // state; the reset-password page's own behavior is what's under test.
    let resetPasswordPage: ResetPasswordPage;

    test.beforeEach(async ({ page }) => {
      await page.route("**/v1/auth/forgot-password", (route) =>
        route.fulfill({ status: 200, json: { message: GENERIC_MESSAGE } })
      );

      const forgotPasswordPage = new ForgotPasswordPage(page);
      await forgotPasswordPage.goto();
      await forgotPasswordPage.requestReset("admin@example.com");
      await page.waitForURL(/\/reset-password/);

      resetPasswordPage = new ResetPasswordPage(page);
    });

    test("should reset the password with a valid code", async ({ page }) => {
      await page.route("**/v1/auth/reset-password", (route) =>
        route.fulfill({ status: 200, json: { message: "Password has been reset successfully." } })
      );

      await resetPasswordPage.resetPassword("ABC234", "NewPass123!@#");

      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText(/password reset successfully/i)).toBeVisible();
    });

    test("should show a server error for an invalid code", async ({ page }) => {
      await page.route("**/v1/auth/reset-password", (route) =>
        route.fulfill({ status: 404, json: { message: "Invalid or expired reset code" } })
      );

      await resetPasswordPage.resetPassword("WRONG1", "NewPass123!@#");

      await expect(page.getByText(/invalid or expired reset code/i)).toBeVisible();
    });

    test("should show validation for weak new password", async () => {
      await resetPasswordPage.codeInput.fill("ABC234");
      await resetPasswordPage.newPasswordInput.fill("weak");
      await resetPasswordPage.confirmPasswordInput.fill("weak");
      await resetPasswordPage.submitButton.click();

      await expect(resetPasswordPage.page.getByText(/password must meet all/i)).toBeVisible();
    });

    test("should show validation for password mismatch", async () => {
      await resetPasswordPage.codeInput.fill("ABC234");
      await resetPasswordPage.newPasswordInput.fill("NewPass123!@#");
      await resetPasswordPage.confirmPasswordInput.fill("Different123!@#");
      await resetPasswordPage.submitButton.click();

      await expect(resetPasswordPage.page.getByText(/passwords do not match/i)).toBeVisible();
    });
  });
});
