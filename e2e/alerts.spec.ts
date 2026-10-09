import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

const sensitiveMarker = "<SENSITIVE_TEST_MARKER>";

test.describe("Safe alerts", () => {
  test.beforeEach(async ({ page }) => {
    // Every API request is intercepted so these privacy checks cannot reach a live backend.
    await page.route("**/v1/**", (route) =>
      route.fulfill({ status: 500, json: { detail: sensitiveMarker } })
    );
  });

  test("hides server details from sign-in feedback and application logs", async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on("console", (event) => consoleMessages.push(event.text()));
    const login = new LoginPage(page);
    await login.goto();
    await login.login("person@example.com", "TestPassword1!");

    await expect(page.getByRole("alert")).toContainText(
      "The service is temporarily unavailable. Please try again later."
    );
    await expect(page.locator("body")).not.toContainText(sensitiveMarker);
    expect(consoleMessages.join("\n")).not.toContain(sensitiveMarker);
  });

  test("explains connection failures without technical details", async ({ page }) => {
    await page.route("**/v1/auth/login", (route) => route.abort("failed"));
    const login = new LoginPage(page);
    await login.goto();
    await login.login("person@example.com", "TestPassword1!");

    await expect(page.getByRole("alert")).toContainText("We couldn't connect. Please try again.");
    await expect(page.getByRole("alert")).not.toContainText(/API|TypeError|fetch/i);
  });

  test("retains email-verification guidance without echoing server text", async ({ page }) => {
    await page.route("**/v1/auth/login", (route) =>
      route.fulfill({ status: 403, json: { code: "EMAIL_NOT_VERIFIED", detail: sensitiveMarker } })
    );
    const login = new LoginPage(page);
    await login.goto();
    await login.login("person@example.com", "TestPassword1!");

    await expect(page.getByRole("alert")).toContainText(
      "Please verify your email before signing in."
    );
    await expect(page.getByRole("link", { name: "Verify your email" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(sensitiveMarker);
  });

  test("hides structured validation payloads in verification alerts", async ({ page }) => {
    await page.route("**/v1/auth/verify-email", (route) =>
      route.fulfill({
        status: 422,
        json: { detail: [{ input: sensitiveMarker, msg: sensitiveMarker }] },
      })
    );
    await page.goto("/verify-email?email=person%40example.com&code=ABC234");
    await page.getByRole("button", { name: /verify email/i }).click();

    await expect(page.getByRole("alert")).toContainText(
      "Check the information you entered and try again."
    );
    await expect(page.locator("body")).not.toContainText(sensitiveMarker);
  });

  test("uses the same conditional reset confirmation for any email", async ({ page }) => {
    await page.route("**/v1/auth/forgot-password", (route) =>
      route.fulfill({ status: 200, json: { message: sensitiveMarker } })
    );
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("unknown@example.com");
    await page.getByRole("button", { name: /send reset code/i }).click();

    await expect(page).toHaveURL(/\/reset-password/);
    await expect(
      page.getByText(
        "If an account exists for this email, a reset code has been sent. Check your email."
      )
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText(sensitiveMarker);
  });
});
