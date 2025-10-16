import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly completeContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeContainer = page.locator('.complete-header');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    if (firstName) await this.firstNameInput.fill(firstName);
    if (lastName) await this.lastNameInput.fill(lastName);
    if (postalCode) await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.count() === 0) return '';
    if (!(await this.errorMessage.isVisible())) return '';
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  async finish() {
    await this.finishButton.click();
  }

  async getCompleteMessage(): Promise<string> {
    if (await this.completeContainer.count() === 0) return '';
    return (await this.completeContainer.textContent())?.trim() || '';
  }
}