import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/e-posta/i).fill(process.env.E2E_TEST_EMAIL!);
  await page.getByLabel(/şifre/i).fill(process.env.E2E_TEST_PASSWORD!);
  await page.getByRole('button', { name: /giriş yap/i }).click();
  await expect(page).toHaveURL('/');
  await page.context().storageState({ path: authFile });
});
