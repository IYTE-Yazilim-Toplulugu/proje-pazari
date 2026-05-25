import { test, expect } from '@playwright/test';

// Auth tests run without stored auth state to test the login flow itself
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Auth flow', () => {
  test('User can log in with valid credentials and is redirected to home', async ({ page }) => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for login E2E tests.',
    );

    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel(/şifre/i).fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('Login with invalid credentials shows an error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(`invalid-${Date.now()}@std.iyte.edu.tr`);
    await page.getByLabel(/şifre/i).fill('not-a-valid-password');
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('Unauthenticated user accessing /profile is redirected to /login', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page).toHaveURL('/login');
  });

  test('User can log out — session is cleared and redirected to /login', async ({ page }) => {
    test.skip(
      !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for logout E2E tests.',
    );

    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(process.env.TEST_USER_EMAIL!);
    await page.getByLabel(/şifre/i).fill(process.env.TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
    // Open user dropdown, then click logout
    await page.locator('[data-slot="dropdown-menu-trigger"]').click();
    await page.getByRole('menuitem', { name: /çıkış yap/i }).click();
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page).toHaveURL('/login');
  });
});
