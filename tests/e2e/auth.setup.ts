import { test as setup, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for authenticated E2E tests.');
  }

  await fs.mkdir(path.dirname(authFile), { recursive: true });
  await page.goto('/login');
  await page.getByLabel(/e-posta/i).fill(email);
  await page.getByLabel(/şifre/i).fill(password);
  await page.getByRole('button', { name: /giriş yap/i }).click();
  await expect(page).toHaveURL('/');
  await page.context().storageState({ path: authFile });
});
