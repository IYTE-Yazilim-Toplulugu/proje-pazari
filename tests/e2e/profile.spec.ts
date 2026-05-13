import { test, expect } from '@playwright/test';

// Uses storageState from auth.setup.ts — no login needed
test.describe('Profile flow', () => {
  test('Authenticated user can view their profile page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');
    await expect(page.getByRole('main').first()).toBeVisible();
  });

  test('Authenticated user can navigate to /my-projects', async ({ page }) => {
    await page.goto('/my-projects');
    await expect(page).toHaveURL('/my-projects');
    await expect(page.getByRole('main').first()).toBeVisible();
  });

  test('Authenticated user can navigate to /applications', async ({ page }) => {
    await page.goto('/applications');
    await expect(page).toHaveURL('/applications');
    await expect(page.getByRole('main').first()).toBeVisible();
  });
});
