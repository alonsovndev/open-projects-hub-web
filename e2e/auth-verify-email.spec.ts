import { test, expect } from "@playwright/test";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

test.describe("Verify Email Flow", () => {
  test("should ask for an account when opened without one", async ({ page }) => {
    const verifyEmailPage = new VerifyEmailPage(page);
    await verifyEmailPage.goto();

    await expect(page.getByText(/don't know which email to verify/i)).toBeVisible();
    await expect(verifyEmailPage.submitButton).toBeDisabled();
  });

  test.describe("after registering", () => {
    // The page needs the email carried via router state from registration, so every
    // spec registers first. The API is mocked so no real mailbox or empty instance is needed.
    let verifyEmailPage: VerifyEmailPage;

    test.beforeEach(async ({ page }) => {
      await page.route("**/v1/auth/register", (route) =>
        route.fulfill({
          status: 201,
          json: {
            email: "ne***@example.com",
            verificationRequired: true,
            nextStep: "verify-email",
            codeExpiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
          },
        })
      );

      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register("New User", "new.user@example.com", "Test123!@#");
      await page.waitForURL(/\/verify-email/);

      verifyEmailPage = new VerifyEmailPage(page);
    });

    test("should verify the code and send the user to sign in", async ({ page }) => {
      await page.route("**/v1/auth/verify-email", (route) =>
        route.fulfill({ status: 200, json: { verified: true } })
      );

      await verifyEmailPage.verify("abc234");

      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText(/email verified\. please sign in/i)).toBeVisible();
    });

    test("should show an invalid code inline", async ({ page }) => {
      await page.route("**/v1/auth/verify-email", (route) =>
        route.fulfill({ status: 400, json: { detail: "Invalid or expired verification code" } })
      );

      await verifyEmailPage.verify("ZZZ999");

      await expect(page.getByRole("alert")).toContainText(/invalid or expired verification code/i);
      await expect(page).toHaveURL(/\/verify-email/);
    });

    test("should explain the resend limit", async ({ page }) => {
      await page.route("**/v1/auth/resend-verification", (route) =>
        route.fulfill({
          status: 429,
          json: { detail: "Too many code requests. Please try again in 15 minutes." },
        })
      );

      await verifyEmailPage.resendCodeButton.click();

      await expect(page.getByText(/too many code requests/i)).toBeVisible();
    });
  });

  test.describe("from the emailed invite link", () => {
    const inviteLink = "/verify-email?email=mate%40example.com&code=ABC234&setPassword=1";

    test("should prefill the code, hide it from the address and ask for a new password", async ({
      page,
    }) => {
      const verifyEmailPage = new VerifyEmailPage(page);
      await page.goto(inviteLink);

      await expect(page.getByText("mate@example.com")).toBeVisible();
      await expect(verifyEmailPage.codeInput).toHaveValue("ABC234");
      await expect(page).not.toHaveURL(/code=/);
      await expect(page.getByLabel(/choose a password/i)).toBeVisible();
    });

    test("should send the chosen password and send the member to sign in", async ({ page }) => {
      let sentBody: unknown;
      await page.route("**/v1/auth/verify-email", async (route) => {
        sentBody = route.request().postDataJSON();
        await route.fulfill({ status: 200, json: { verified: true } });
      });
      await page.goto(inviteLink);

      await page.getByLabel(/choose a password/i).fill("MyOwn#Pass1");
      await page.getByLabel(/confirm password/i).fill("MyOwn#Pass1");
      await page.getByRole("button", { name: /verify email/i }).click();

      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText(/email verified and password set/i)).toBeVisible();
      expect(sentBody).toEqual({
        email: "mate@example.com",
        code: "ABC234",
        password: "MyOwn#Pass1",
      });
    });
  });
});
