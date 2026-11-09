import { expect, type Locator, type Page } from '@playwright/test';

export type TodoFilter = 'All' | 'Active' | 'Completed';

export class TodoPage {
  private readonly newTodoInput: Locator;
  private readonly todoItems: Locator;
  private readonly remainingItemCount: Locator;

  constructor(readonly page: Page) {
    this.newTodoInput = page.getByRole('textbox', {
      name: 'What needs to be done?',
    });
    this.todoItems = page
      .getByRole('listitem')
      .filter({ has: page.getByRole('checkbox') });
    this.remainingItemCount = page.getByText(/^\d+ items? left$/);
  }

  async goto(url = 'https://demo.playwright.dev/todomvc'): Promise<void> {
    await this.page.goto(url);
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  async completeTodo(title: string): Promise<void> {
    await this.todoItem(title).getByRole('checkbox').check();
  }

  async uncompleteTodo(title: string): Promise<void> {
    await this.todoItem(title).getByRole('checkbox').uncheck();
  }

  async filterTodos(filter: TodoFilter): Promise<void> {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  async verifyRemainingItemCount(expectedCount: number): Promise<void> {
    const itemLabel = expectedCount === 1 ? 'item' : 'items';
    await expect(this.remainingItemCount).toHaveText(
      `${expectedCount} ${itemLabel} left`,
    );
  }

  async verifyItemCount(expectedCount: number): Promise<void> {
    await expect(this.todoItems).toHaveCount(expectedCount);
  }

  private todoItem(title: string): Locator {
    return this.todoItems.filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }
}
