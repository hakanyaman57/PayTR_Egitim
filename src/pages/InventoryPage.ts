import type { Locator, Page } from '@playwright/test';

export type ProductSortOrder =
  | 'Name (A to Z)'
  | 'Name (Z to A)'
  | 'Price (low to high)'
  | 'Price (high to low)';

export type CheapestProduct = 'Sauce Labs Onesie' | 'Sauce Labs Bike Light';

export class InventoryPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly sortDropdown: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.sortDropdown = page.getByRole('combobox', {
      name: 'Sort products',
    });
  }

  async goto(url = 'https://www.saucedemo.com'): Promise<void> {
    await this.page.goto(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async sortProducts(order: ProductSortOrder): Promise<void> {
    await this.sortDropdown.selectOption({ label: order });
  }

  async addProductToCart(product: CheapestProduct): Promise<void> {
    const cheapestProductIndex = product === 'Sauce Labs Onesie' ? 0 : 1;
    await this.page
      .getByRole('button', { name: 'Add to cart', exact: true })
      .nth(cheapestProductIndex)
      .click();
  }
}
