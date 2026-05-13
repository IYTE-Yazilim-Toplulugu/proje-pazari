import { test, expect } from '@playwright/test';

test.describe('Admin flow', () => {
  test('Non-admin user accessing /admin is redirected to /unauthorized', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/unauthorized');
  });

  test('Admin user can access the admin dashboard', async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD;

    // Skip if admin credentials not configured
    if (!adminEmail || !adminPassword) {
      test.skip();
      return;
    }

    await page.context().clearCookies();
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(adminEmail);
    await page.getByLabel(/şifre/i).fill(adminPassword);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('main').first()).toBeVisible();
  });
});
