import { Page, Locator, expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.getByLabel(/full name/i);
    this.emailInput = page.getByLabel(/work email|email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.termsCheckbox = page.getByRole("checkbox", { name: /terms/i });
    this.submitButton = page.getByRole("button", { name: /create account/i });
    this.errorMessage = page.getByRole("alert");
    this.signInLink = page.getByRole("link", { name: /sign in/i });
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(fullName: string, email: string, password: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.termsCheckbox.check();
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string) {
    await this.errorMessage.waitFor({ state: "visible" });
    await expect(this.errorMessage).toContainText(message);
  }
}
