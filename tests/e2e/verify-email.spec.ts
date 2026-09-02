import { test, expect, type Page } from '@playwright/test';

// Verification is reached from an email link, always while logged out.
test.use({ storageState: { cookies: [], origins: [] } });

const VERIFY_ENDPOINT = '**/api/v1/auth/verify-email*';

/**
 * Stubs the verification endpoint. A real verification token cannot be obtained
 * from a test run — it only exists inside a delivered email — so the backend
 * response is faked to drive each UI state deterministically.
 */
async function stubVerify(page: Page, status: number, body: Record<string, unknown>) {
  await page.route(VERIFY_ENDPOINT, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  );
}

test.describe('Email verification', () => {
  test('Valid token shows the success state and a login action', async ({ page }) => {
    await stubVerify(page, 200, {
      code: 0,
      message: 'Email verified successfully',
      timestamp: new Date().toISOString(),
    });

    await page.goto('/verify-email?token=valid-token');

    await expect(page.getByRole('heading', { name: /doğrulandı/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /giriş yap/i })).toBeVisible();
  });

  test('Invalid token shows the failure state with a resend form', async ({ page }) => {
    await stubVerify(page, 400, {
      code: 4,
      errorCode: 'INVALID_VERIFICATION_TOKEN',
      message: 'Invalid verification token',
      timestamp: new Date().toISOString(),
    });

    await page.goto('/verify-email?token=bad-token');

    await expect(page.getByRole('heading', { name: /geçersiz/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /yeni doğrulama e-postası gönder/i })
    ).toBeVisible();
  });

  test('Missing token shows the invalid-link state without calling the API', async ({ page }) => {
    let requested = false;
    await page.route(VERIFY_ENDPOINT, (route) => {
      requested = true;
      return route.abort();
    });

    await page.goto('/verify-email');

    await expect(page.getByRole('heading', { name: /eksik/i })).toBeVisible();
    expect(requested).toBe(false);
  });
});
