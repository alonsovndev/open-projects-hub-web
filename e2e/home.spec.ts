import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the home page", async ({ page }) => {
    await page.goto("/");

    // Basic smoke test - adjust selectors based on your actual home page
    await expect(page).toHaveTitle(/Open Projects Hub/i);
  });
});
