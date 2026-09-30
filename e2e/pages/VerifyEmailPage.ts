import { Page, Locator } from "@playwright/test";

export class VerifyEmailPage {
  readonly page: Page;
  readonly codeInput: Locator;
  readonly submitButton: Locator;
  readonly resendCodeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.codeInput = page.getByLabel(/verification code/i);
    this.submitButton = page.getByRole("button", { name: /verify email/i });
    this.resendCodeButton = page.getByRole("button", { name: /resend code/i });
  }

  async goto() {
    await this.page.goto("/verify-email");
  }

  async verify(code: string) {
    await this.codeInput.fill(code);
    await this.submitButton.click();
  }
}
