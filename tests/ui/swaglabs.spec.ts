import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { InventoryPage } from '../../pages/inventory-page';
import { CartPage } from '../../pages/cart-page';
import { CheckoutPage } from '../../pages/checkout-page';

test.describe.parallel('Swag Labs UI Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  test('Successful login', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
  });

  test('Invalid login shows error', async () => {
    await loginPage.login('qweqweqweqwe', 'asdasdasdasd');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('Add and remove items from cart and verify counter', async () => {
    await loginPage.login('standard_user', 'secret_sauce');

    //adiciona 3 produtos
    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.addProductToCart(2);

    //valida contador
    let cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(3);

    await inventoryPage.goToCart();
    
    //remove os 2 primeiros produtos do array
    const cartPage = new CartPage(inventoryPage.page);
    await cartPage.removeItem(0);
    await cartPage.removeItem(0);

    //valida contador
    await cartPage.continueShoppingButton.click();
    cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);
  });

  test('Checkout validation error when required fields are missing', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(inventoryPage.page);
    await cartPage.proceedToCheckout();

    //continuando sem preencher dados
    const checkoutPage = new CheckoutPage(inventoryPage.page);
    await checkoutPage.continue();

    //valida mensagem de erro
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('First Name is required');
  });
});