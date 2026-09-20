import { Page, Locator, expect } from "@playwright/test";

export class ResetPasswordPage {
  readonly page: Page;
  readonly codeInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly resendCodeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.codeInput = page.getByLabel(/reset code/i);
    this.newPasswordInput = page.getByLabel(/^new password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm new password/i);
    this.submitButton = page.getByRole("button", { name: /update password/i });
    this.resendCodeButton = page.getByRole("button", { name: /resend code/i });
  }

  async goto() {
    await this.page.goto("/reset-password");
  }

  async resetPassword(code: string, newPassword: string) {
    await this.codeInput.fill(code);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.submitButton.click();
  }
}
