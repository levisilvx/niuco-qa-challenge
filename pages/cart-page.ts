import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // retorna lista de items no carrinho
  async getItemNames(): Promise<string[]> {
    const count = await this.cartItems.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      names.push((await item.locator('.inventory_item_name').textContent())?.trim() || '');
    }
    return names;
  }

  // remove item
  async removeItem(index: number) {
    const count = await this.cartItems.count();
    if (index < 0 || index >= count) throw new Error('index out of range');
    const item = this.cartItems.nth(index);
    await item.locator('button').click();
  }

  // tenta remover e retorna false se não existir
  async tryRemoveItemAt(index: number): Promise<boolean> {
    const count = await this.cartItems.count();
    if (index < 0 || index >= count) return false;
    const item = this.cartItems.nth(index);
    await item.locator('button').click();
    return true;
  }

  // remove item por nome, retorna false se não existir
  async removeItemByName(name: string): Promise<boolean> {
    const names = await this.getItemNames();
    const idx = names.indexOf(name);
    if (idx === -1) return false;
    await this.removeItem(idx);
    return true;
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}