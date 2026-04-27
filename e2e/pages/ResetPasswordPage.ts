import { Page, Locator, expect } from "@playwright/test";

export class ResetPasswordPage {
  readonly page: Page;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currentPasswordInput = page.getByLabel(/current password/i);
    this.newPasswordInput = page.getByLabel(/^new password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm new password/i);
    this.submitButton = page.getByRole("button", { name: /update password/i });
  }

  async goto() {
    await this.page.goto("/reset-password");
  }

  async resetPassword(currentPassword: string, newPassword: string) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.submitButton.click();
  }
}
