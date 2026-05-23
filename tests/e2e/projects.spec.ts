import { test, expect } from '@playwright/test';

test.describe('Project flow', () => {
  test('Projects list page loads and displays project cards', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: /projeler|projects/i })).toBeVisible();
    await expect(page.locator('a[href*="/projects/"]').first()).toBeVisible();
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
    const projectLinks = await page.locator('a[href*="/projects/"]').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    );

    for (const href of projectLinks) {
      await page.goto(href);
      const applyButton = page.getByRole('button', { name: /^başvur$|^apply$/i });

      if (await applyButton.isVisible()) {
        await applyButton.click();
        await page.getByRole('button', { name: /başvuruyu onayla|confirm application/i }).click();
        await expect(page.getByText(/başvuru başarılı|application successful/i)).toBeVisible();
        return;
      }
    }

    test.skip(true, 'No OPEN non-owner project was available to apply to.');
  });

  test('Authenticated user can navigate to owned projects', async ({ page }) => {
    await page.goto('/my-projects');
    await expect(page).toHaveURL(/\/my-projects/);
    await expect(page.getByRole('heading', { name: /projelerim|my projects/i })).toBeVisible();
  });
});
