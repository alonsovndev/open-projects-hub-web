import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Reset Password Flow", () => {
  let resetPasswordPage: ResetPasswordPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await page.waitForURL(/\/dashboard/);

    // Navigate to reset password
    resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.goto();
  });

  test("should successfully reset password", async ({ page }) => {
    await resetPasswordPage.resetPassword(testUsers.admin.password, "NewPass123!@#");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/password updated successfully/i)).toBeVisible();
  });

  test("should show validation for weak new password", async () => {
    await resetPasswordPage.currentPasswordInput.fill(testUsers.admin.password);
    await resetPasswordPage.newPasswordInput.fill("weak");
    await resetPasswordPage.confirmPasswordInput.fill("weak");
    await resetPasswordPage.submitButton.click();

    await expect(resetPasswordPage.page.getByText(/password must meet all/i)).toBeVisible();
  });

  test("should show validation for password mismatch", async () => {
    await resetPasswordPage.currentPasswordInput.fill(testUsers.admin.password);
    await resetPasswordPage.newPasswordInput.fill("NewPass123!@#");
    await resetPasswordPage.confirmPasswordInput.fill("Different123!@#");
    await resetPasswordPage.submitButton.click();

    await expect(resetPasswordPage.page.getByText(/passwords do not match/i)).toBeVisible();
  });
});
