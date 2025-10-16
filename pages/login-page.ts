import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // retorna texto se visível, senão ''
  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.count() === 0) return '';
    if (!(await this.errorMessage.isVisible())) return '';
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }
}