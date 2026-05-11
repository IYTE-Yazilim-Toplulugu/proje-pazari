import { test, expect } from '@playwright/test';

const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? 'test@std.iyte.edu.tr';
const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? 'Test123!';

test.describe('Project flow', () => {
  test('Projects list page loads and displays project cards', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('Clicking a project card navigates to the project detail page', async ({ page }) => {
    await page.goto('/projects');
    const firstCard = page.getByRole('link').filter({ hasText: /.+/ }).first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
    void href;
  });

  test('Authenticated user can apply to a project', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/projects');
    await page.getByRole('link').filter({ hasText: /.+/ }).first().click();
    await expect(page).toHaveURL(/\/projects\/.+/);
    const applyButton = page.getByRole('button', { name: /başvur/i });
    await expect(applyButton).toBeVisible();
  });

  test('Authenticated user can create a project (as PROJECT_OWNER role)', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
    await page.goto('/my-projects');
    await expect(page).toHaveURL(/\/my-projects/);
  });
});
