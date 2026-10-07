import { Page, Locator, expect } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToSignInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.submitButton = page.getByRole("button", { name: /send reset code/i });
    this.backToSignInLink = page.getByRole("link", { name: /^sign in$/i });
  }

  async goto() {
    await this.page.goto("/forgot-password");
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
