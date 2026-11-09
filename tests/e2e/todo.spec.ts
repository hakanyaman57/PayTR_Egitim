import { expect, test } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';

test.describe('Todo list management', () => {
  test('adds three todos, completes the second, and filters by status', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page);
    const todos = ['Buy groceries', 'Read a book', 'Write a report'];

    await todoPage.goto();

    for (const todo of todos) {
      await todoPage.addTodo(todo);
    }

    await todoPage.verifyItemCount(3);
    await todoPage.verifyRemainingItemCount(3);

    await todoPage.completeTodo(todos[1]);
    await todoPage.verifyRemainingItemCount(2);

    await todoPage.filterTodos('Active');
    await todoPage.verifyItemCount(2);
    await expect(page.getByText(todos[0], { exact: true })).toBeVisible();
    await expect(page.getByText(todos[1], { exact: true })).toBeHidden();
    await expect(page.getByText(todos[2], { exact: true })).toBeVisible();
    await todoPage.verifyRemainingItemCount(2);

    await todoPage.filterTodos('Completed');
    await todoPage.verifyItemCount(1);
    await expect(page.getByText(todos[0], { exact: true })).toBeHidden();
    await expect(page.getByText(todos[1], { exact: true })).toBeVisible();
    await expect(page.getByText(todos[2], { exact: true })).toBeHidden();
    await todoPage.verifyRemainingItemCount(2);
  });
});
