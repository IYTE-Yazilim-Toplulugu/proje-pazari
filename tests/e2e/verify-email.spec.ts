import { test, expect, type Page } from '@playwright/test';
import en from '../../messages/en.json';
import tr from '../../messages/tr.json';

// These exercise the real page, hooks, and HTTP parsing. Only the external API
// is stubbed: no account, delivered email, or single-use production token needed.
test.use({ storageState: { cookies: [], origins: [] } });
const VERIFY_ENDPOINT = '**/api/v1/auth/verify-email*';
const TOKEN = 'verification-secret+with/slash=and&query';
const verificationUrl = `/verify-email?token=${encodeURIComponent(TOKEN)}`;
const responseBody = (errorCode?: string) => ({
  code: errorCode ? 4 : 0,
  message: errorCode ? 'Verification failed' : 'Email verified',
  timestamp: '2026-09-27T00:00:00',
  ...(errorCode ? { errorCode } : {}),
});

async function stubVerify(page: Page, status: number, body: Record<string, unknown>) {
  await page.route(VERIFY_ENDPOINT, route => route.fulfill({ status, json: body }));
}

for (const [locale, messages] of Object.entries({ en, tr })) {
  const t = messages.auth.verifyEmail;
  test.describe(`Email verification (${locale})`, () => {
    test.beforeEach(async ({ context, baseURL, page }) => {
      await context.addCookies([{ name: 'NEXT_LOCALE', value: locale, url: baseURL! }]);
      await page.route('**/api/v1/users/me', route => route.fulfill({
        status: 401, json: { code: 5, message: 'Not authenticated' },
      }));
    });

    test('shows loading, verifies exactly once, and preserves locale when logging in', async ({ page }) => {
      await page.clock.install();
      const requests: { method: string; token: string | null }[] = [];
      let release!: () => void;
      const pending = new Promise<void>(resolve => { release = resolve; });
      await page.route(VERIFY_ENDPOINT, async route => {
        const request = route.request();
        requests.push({ method: request.method(), token: new URL(request.url()).searchParams.get('token') });
        await pending;
        await route.fulfill({ status: 200, json: responseBody() });
      });
      await page.goto(verificationUrl);
      await expect(page.getByRole('status', { name: t.loading })).toBeVisible();
      // The header's guest session lookup must not redirect this public page
      // while verification is pending (session-expiry redirects wait 1500ms).
      await page.clock.runFor(2000);
      await expect(page).toHaveURL(/\/verify-email\?/);
      release();
      await expect(page.getByRole('heading', { name: t.successTitle, exact: true })).toBeVisible();
      await expect(page.locator('body')).not.toContainText(TOKEN);
      await page.evaluate(() => {
        window.dispatchEvent(new Event('focus'));
        window.dispatchEvent(new Event('online'));
      });
      const login = page.getByRole('link', { name: t.goToLogin, exact: true });
      await expect(login).toHaveAttribute('href', '/login');
      await login.click();
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: messages.auth.login.title, exact: true })).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      expect(requests).toEqual([{ method: 'GET', token: TOKEN }]);
    });

    test('an expired existing session does not interrupt verification', async ({ page, context, baseURL }) => {
      await page.clock.install();
      await context.addCookies(['authToken', 'refreshToken'].map(name => ({
        name, value: 'expired-test-credential', url: baseURL!,
      })));
      await page.route('**/api/v1/auth/refresh*', route => route.fulfill({
        status: 401, json: { code: 5, message: 'Expired refresh token' },
      }));
      let release!: () => void;
      const pending = new Promise<void>(resolve => { release = resolve; });
      let verificationCalls = 0;
      await page.route(VERIFY_ENDPOINT, async route => {
        verificationCalls++;
        await pending;
        await route.fulfill({ status: 200, json: responseBody() });
      });
      const refreshResponse = page.waitForResponse(response => response.url().includes('/api/v1/auth/refresh'));
      await page.goto(verificationUrl);
      await refreshResponse;
      await expect(page.getByRole('status', { name: t.loading })).toBeVisible();
      await page.clock.runFor(2000);
      await expect(page).toHaveURL(/\/verify-email\?/);
      release();
      await expect(page.getByRole('heading', { name: t.successTitle, exact: true })).toBeVisible();
      expect(verificationCalls).toBe(1);
      expect((await context.cookies()).filter(cookie => ['authToken', 'refreshToken'].includes(cookie.name))).toEqual([]);
    });

    for (const query of ['', '?token=', '?token=%20%20']) {
      test(`rejects missing/empty token (${query || 'no query'}) without a verification request`, async ({ page }) => {
        const requests: string[] = [];
        await page.route(VERIFY_ENDPOINT, route => {
          requests.push(route.request().url());
          return route.abort();
        });
        await page.goto(`/verify-email${query}`);
        await expect(page.getByRole('heading', { name: t.tokenMissingTitle })).toBeVisible();
        // Navigate after hydration, so the zero-request assertion isn't just SSR.
        await page.getByRole('link', { name: t.backToLogin, exact: true }).click();
        await expect(page).toHaveURL(/\/login$/);
        expect(requests).toEqual([]);
      });
    }

    for (const state of [
      { errorCode: 'INVALID_VERIFICATION_TOKEN', title: t.invalidTitle },
      { errorCode: 'VERIFICATION_TOKEN_EXPIRED', title: t.expiredTitle },
    ]) {
      test(`${state.errorCode} shows a localized failure and supports resend`, async ({ page }) => {
        await stubVerify(page, 400, responseBody(state.errorCode));
        const resendRequests: unknown[] = [];
        await page.route('**/api/v1/auth/resend-verification', route => {
          resendRequests.push(route.request().postDataJSON());
          return route.fulfill({ status: 200, json: responseBody() });
        });
        await page.goto(verificationUrl);
        await expect(page.getByRole('heading', { name: state.title })).toBeVisible();
        await page.getByRole('textbox', { name: t.resend.emailLabel, exact: true }).fill('student@std.iyte.edu.tr');
        await page.getByRole('button', { name: t.resend.submitBtn }).click();
        await expect(page.getByRole('status')).toHaveText(t.resend.success);
        expect(resendRequests).toEqual([{ email: 'student@std.iyte.edu.tr' }]);
      });
    }

    test('already-verified email shows an informational state and login action', async ({ page }) => {
      await stubVerify(page, 409, responseBody('EMAIL_ALREADY_VERIFIED'));
      await page.goto(verificationUrl);
      await expect(page.getByRole('heading', { name: t.alreadyVerifiedTitle })).toBeVisible();
      await expect(page.getByRole('link', { name: t.goToLogin, exact: true })).toHaveAttribute('href', '/login');
      await expect(page.getByRole('button', { name: t.resend.submitBtn })).toHaveCount(0);
    });

    for (const failure of ['server', 'network']) {
      test(`${failure} failure shows a generic error without exposing the token`, async ({ page }) => {
        const errorLogs: string[] = [];
        page.on('console', message => {
          if (message.type() === 'error') errorLogs.push(message.text());
        });
        await page.route(VERIFY_ENDPOINT, route => failure === 'network'
          ? route.abort('failed')
          : route.fulfill({ status: 500, json: { ...responseBody(), code: 9, message: `Failed for token ${TOKEN}` } }));
        await page.goto(verificationUrl);
        await expect(page.getByRole('heading', { name: t.errorTitle })).toBeVisible();
        await expect(page.locator('body')).not.toContainText(TOKEN);
        expect(errorLogs.join('\n')).not.toContain(TOKEN);
      });
    }

    test('direct refresh resolves and displays the subsequent already-verified response', async ({ page }) => {
      let calls = 0;
      await page.route(VERIFY_ENDPOINT, route => {
        calls++;
        return route.fulfill({
          status: calls === 1 ? 200 : 409,
          json: responseBody(calls === 1 ? undefined : 'EMAIL_ALREADY_VERIFIED'),
        });
      });
      await page.goto(verificationUrl);
      await expect(page.getByRole('heading', { name: t.successTitle, exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('heading', { name: t.alreadyVerifiedTitle })).toBeVisible();
      expect(calls).toBe(2);
    });
  });
}
