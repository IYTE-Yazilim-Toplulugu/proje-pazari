import { test, expect } from '@playwright/test';

const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? 'test@std.iyte.edu.tr';
const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? 'Test123!';

test.describe('Admin flow', () => {
  test('Non-admin user accessing /admin is redirected to /unauthorized', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/admin');
    await expect(page).toHaveURL('/unauthorized');
  });

  test('Admin user can access the admin dashboard', async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL ?? VALID_EMAIL;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? VALID_PASSWORD;

    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(adminEmail);
    await page.getByLabel(/şifre/i).fill(adminPassword);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('main')).toBeVisible();
  });
});
