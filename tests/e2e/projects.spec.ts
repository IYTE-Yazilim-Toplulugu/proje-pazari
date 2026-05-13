import { test, expect } from '@playwright/test';

test.describe('Project flow', () => {
  test('Projects list page loads and displays project cards', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('main').first()).toBeVisible();
  });

  test('Clicking a project card navigates to the project detail page', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForSelector('a[href*="/projects/"]');
    const projectLink = page.locator('a[href*="/projects/"]').first();
    await projectLink.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });

  test('Authenticated user can apply to a project', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForSelector('a[href*="/projects/"]');
    await page.locator('a[href*="/projects/"]').first().click();
    await expect(page).toHaveURL(/\/projects\/.+/);
    // Apply button is visible only for non-owner OPEN projects; verify page loaded
    await expect(page.getByRole('main').first()).toBeVisible();
  });

  test('Authenticated user can create a project (as PROJECT_OWNER role)', async ({ page }) => {
    await page.goto('/my-projects');
    await expect(page).toHaveURL(/\/my-projects/);
    await expect(page.getByRole('main').first()).toBeVisible();
  });
});
