import { test, expect } from '@playwright/test';

const VALID_EMAIL = process.env.E2E_TEST_EMAIL ?? 'test@std.iyte.edu.tr';
const VALID_PASSWORD = process.env.E2E_TEST_PASSWORD ?? 'Test123!';

test.describe('Auth flow', () => {
  test('User can log in with valid credentials and is redirected to home', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('Login with invalid credentials shows an error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill('wrong@std.iyte.edu.tr');
    await page.getByLabel(/şifre/i).fill('wrongpassword');
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('Unauthenticated user accessing /profile is redirected to /login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/login');
  });

  test('User can log out — session is cleared and redirected to /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-posta/i).fill(VALID_EMAIL);
    await page.getByLabel(/şifre/i).fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page).toHaveURL('/');
    await page.getByRole('button', { name: /çıkış/i }).click();
    await expect(page).toHaveURL('/login');
  });
});
