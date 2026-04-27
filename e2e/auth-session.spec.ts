import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { testUsers } from "./fixtures/test-users";

test.describe("Session Management", () => {
  test("should persist session after page reload", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await page.waitForURL(/\/dashboard/);

    // Reload page
    await page.reload();

    // Should still be on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should clear session on logout", async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await page.waitForURL(/\/dashboard/);

    // Click logout
    await page.getByRole("button", { name: /logout|sign out/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Session should be cleared from localStorage
    const sessionKey = "open-projects-hub.admin-session";
    const session = await page.evaluate((key) => localStorage.getItem(key), sessionKey);
    expect(session).toBeNull();
  });
});
