import { test, expect } from '@playwright/test';

const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? 'test@std.iyte.edu.tr';
const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? 'Test123!';

test.describe('Profile flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('Authenticated user can view their profile page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('Authenticated user can navigate to /my-projects', async ({ page }) => {
    await page.goto('/my-projects');
    await expect(page).toHaveURL('/my-projects');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('Authenticated user can navigate to /applications', async ({ page }) => {
    await page.goto('/applications');
    await expect(page).toHaveURL('/applications');
    await expect(page.getByRole('main')).toBeVisible();
  });
});
