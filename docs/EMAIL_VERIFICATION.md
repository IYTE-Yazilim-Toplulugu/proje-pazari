# Email verification

The email entry point is `/verify-email?token=<encoded-token>`. Routes are
unprefixed; `NEXT_LOCALE` selects Turkish (`tr`, the default) or English (`en`).
The page's `/login` links preserve that cookie. General registration/logout
redirect corrections are tracked separately in #117.

The page calls the existing `verifyEmail` helper using
`GET /api/v1/auth/verify-email?token=...`. It issues one request per token in the
current query cache, including React Strict Mode remounts. Focus, reconnect, and
component remount do not retry a single-use token. A full browser refresh starts
a new attempt; an already-verified response is informational.
The header's guest-session check and an expired existing session must not
redirect away from verification or clear its in-flight query.

| Input/result | UI |
| --- | --- |
| Missing, empty, or whitespace token | Invalid-link message; no verification request |
| Pending request | Localized loading indicator |
| Success | Success message and login link |
| `INVALID_VERIFICATION_TOKEN` | Invalid-link message and resend form |
| `VERIFICATION_TOKEN_EXPIRED` | Expired-link message and resend form |
| `EMAIL_ALREADY_VERIFIED` | Informational message and login link |
| Other API or network failure | Generic message asking the user to reopen the link; no automatic retry |

Application request logging redacts token query parameters. Unexpected
verification errors log only a fixed diagnostic because upstream messages can
contain credentials. The page never renders the token or upstream error text.
Infrastructure/access logs must also redact query strings on this route;
Next.js development access logs include the requested URL, so use synthetic
tokens during local testing.

## Repeatable checks

```sh
npm test -- --runInBand
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
```

Start the frontend with a valid API origin (the browser tests intercept its API
requests, so a running backend and credentials are not required):

```sh
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080 npm run dev -- --hostname 127.0.0.1 --port 3111
```

In another terminal, with Playwright Chromium installed:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3111 npx playwright test tests/e2e/verify-email.spec.ts --project=chromium-public --workers=2
```

The 22 browser cases cover both locales, loading, encoded tokens, single-request
behavior, login navigation, missing/empty tokens, invalid/expired tokens,
resending, already-verified responses, server/network errors, token privacy, and
direct refresh, and guest/expired-session behavior beyond the session-redirect
delay. Component coverage additionally checks React Strict Mode and
resend validation/failure states. These browser tests stub the external API;
they do not establish actual email delivery or production deployment status.

## Backend and deployment

Backend issue `proje-pazari-backend#150` implements `FrontendVerificationLinkBuilder`,
used by both initial-registration and resend email handlers. Configure
`FRONTEND_URL` with the deployed frontend origin and keep
`FRONTEND_VERIFY_EMAIL_PATH=/verify-email`. The backend API URL is unchanged.

Run the companion repository's contract tests:

```sh
./gradlew test --tests '*FrontendVerificationLinkBuilderTest' --tests '*EmailVerificationEventHandlerTest' --tests '*UserRegisteredEventHandlerTest'
```

Deploy the frontend route before enabling emails that point to it. For rollout,
check that a newly delivered registration email and a resent email point to the
frontend `/verify-email` route, open a valid link, and confirm the localized
success/login flow. Confirm expired and reused links give the corresponding
localized state, and check edge/access-log redaction. Never copy real tokens into
issue comments, screenshots, or test fixtures.
