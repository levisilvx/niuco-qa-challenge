import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addProductToCart(index: number) {
    const product = this.productItems.nth(index);
    await product.locator('button:has-text("Add to cart")').click();
  }

  async removeProductFromCart(index: number) {
    const product = this.productItems.nth(index);
    await product.locator('button:has-text("Remove")').click();
  }

  async getProductName(index: number): Promise<string> {
    const product = this.productItems.nth(index);
    return (await product.locator('.inventory_item_name').textContent())?.trim() || '';
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = (await this.cartBadge.textContent()) || '0';
    return parseInt(text.trim(), 10) || 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}