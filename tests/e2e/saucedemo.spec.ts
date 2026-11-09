import { expect, test } from '@playwright/test';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { InventoryPage } from '../../src/pages/InventoryPage';

const username = 'standard_user';
const password = 'secret_sauce';

test.describe('SauceDemo purchase flow', () => {
  test('sorts by price, adds the two cheapest products, and completes checkout', async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.goto();
    await inventoryPage.login(username, password);
    await expect(
      page.getByText('Products', { exact: true }),
    ).toBeVisible();

    await inventoryPage.sortProducts('Price (low to high)');
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$9.99', { exact: true })).toBeVisible();

    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await expect(
      page.getByRole('button', { name: 'Cart, 2 items' }),
    ).toBeVisible();

    await page.getByRole('button', { name: /^Cart/ }).click();
    await checkoutPage.verifyCartItemCount(2);
    await expect(
      page.getByRole('button', {
        name: 'View details for Sauce Labs Onesie',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: 'View details for Sauce Labs Bike Light',
      }),
    ).toBeVisible();
    await expect(page.getByText('$7.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$9.99', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Checkout' }).click();
    await checkoutPage.enterCustomerInformation('Alex', 'Doe', '10001');
    await page.getByRole('button', { name: 'Continue' }).click();

    await checkoutPage.verifyCartItemCount(2);
    await expect(page.getByText('Item total: $17.98')).toBeVisible();
    await expect(page.getByText('Tax: $1.44')).toBeVisible();
    await expect(page.getByText('Total: $19.42')).toBeVisible();

    await checkoutPage.finishOrder();
    await checkoutPage.verifyOrderConfirmation();
    await expect(
      page.getByRole('button', { name: 'Cart, empty' }),
    ).toBeVisible();
  });

  test('shows an error when login credentials are invalid', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.login(username, 'incorrect_password');

    await expect(page.getByText(/Epic sadface:/)).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(
      page.getByText('Products', { exact: true }),
    ).toBeHidden();
  });

  test('requires customer information before continuing checkout', async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.login(username, password);
    await inventoryPage.sortProducts('Price (low to high)');
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await page.getByRole('button', { name: /^Cart/ }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Error: First Name is required')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.getByRole('button', { name: 'Finish' })).toBeHidden();
  });

  test('keeps product prices in ascending order, including tied prices', async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const productPrices = page.getByText(/^\$\d+\.\d{2}$/);

    await inventoryPage.goto();
    await inventoryPage.login(username, password);
    await inventoryPage.sortProducts('Price (low to high)');

    await expect(productPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);
  });
});
