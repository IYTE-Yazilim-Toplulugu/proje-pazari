import { StrictMode } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyEmailPage from '../page';
import { user, auth } from '@/lib/api';
import { ApiError } from '@/lib/api/base';
import { ErrorCode, ResponseCodeSchema } from '@/lib/models/Api';
import messages from '@/messages/en.json';

// authHooks pulls in the logout server action, which validates the runtime env.
jest.mock('@/lib/env', () => ({
  env: { NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080' },
}));

jest.mock('@/lib/api', () => ({
  user: { verifyEmail: jest.fn() },
  auth: { resendVerificationEmail: jest.fn() },
}));

// Resolve keys against the real en.json so a key missing from the message
// catalogue fails the test instead of silently rendering its own name.
jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const path = `${namespace}.${key}`.split('.');
    const value = path.reduce<unknown>(
      (acc, segment) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[segment] : undefined,
      jest.requireActual('@/messages/en.json')
    );
    if (typeof value !== 'string') {
      throw new Error(`Missing translation: ${path.join('.')}`);
    }
    return value;
  },
}));

const mockSearchParams = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const t = messages.auth.verifyEmail;
const mockVerifyEmail = jest.mocked(user.verifyEmail);
const mockResend = jest.mocked(auth.resendVerificationEmail);

const setToken = (token: string | null) => {
  mockSearchParams.mockReturnValue({ get: () => token });
};

// ApiError carries the coarse ResponseCode from the payload, not an HTTP status.
const apiError = (errorCode: string) =>
  new ApiError('Verification failed', ResponseCodeSchema.enum.BAD_REQUEST, errorCode);

const serverError = () =>
  new ApiError('Internal server error', ResponseCodeSchema.enum.INTERNAL_SERVER_ERROR);

describe('VerifyEmailPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    // The hooks log failures deliberately; keep that out of the test output.
    jest.spyOn(console, 'error').mockImplementation(() => {});
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    setToken('verification-token-123');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = (strict = false) => {
    const tree = (
      <QueryClientProvider client={queryClient}>
        <VerifyEmailPage />
      </QueryClientProvider>
    );
    return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
  };

  describe('missing token', () => {
    it('shows the invalid-link state and makes no request when the token is absent', async () => {
      setToken(null);
      renderPage();

      expect(await screen.findByText(t.tokenMissingTitle)).toBeInTheDocument();
      expect(mockVerifyEmail).not.toHaveBeenCalled();
    });

    it('treats an empty token the same as a missing one', async () => {
      setToken('   ');
      renderPage();

      expect(await screen.findByText(t.tokenMissingTitle)).toBeInTheDocument();
      expect(mockVerifyEmail).not.toHaveBeenCalled();
    });
  });

  describe('verification outcomes', () => {
    it('shows a loading state while the request is pending', async () => {
      mockVerifyEmail.mockReturnValue(new Promise(() => {}));
      renderPage();

      expect(await screen.findByRole('status', { name: t.loading })).toBeInTheDocument();
    });

    it('shows the success state and a login action for a valid token', async () => {
      mockVerifyEmail.mockResolvedValue({ code: 0, message: 'ok' } as never);
      renderPage();

      expect(await screen.findByText(t.successTitle)).toBeInTheDocument();
      expect(screen.getByText(t.goToLogin)).toHaveAttribute('href', '/login');
    });

    it('calls verifyEmail exactly once with the token from the query string', async () => {
      mockVerifyEmail.mockResolvedValue({ code: 0, message: 'ok' } as never);
      renderPage();

      await screen.findByText(t.successTitle);
      expect(mockVerifyEmail).toHaveBeenCalledTimes(1);
      expect(mockVerifyEmail).toHaveBeenCalledWith('verification-token-123');
    });

    it('does not duplicate the request under React Strict Mode', async () => {
      mockVerifyEmail.mockResolvedValue({ code: 0, message: 'ok' } as never);
      renderPage(true);

      await screen.findByText(t.successTitle);
      expect(mockVerifyEmail).toHaveBeenCalledTimes(1);
    });

    it('shows the invalid-token state', async () => {
      mockVerifyEmail.mockRejectedValue(apiError(ErrorCode.INVALID_VERIFICATION_TOKEN));
      renderPage();

      expect(await screen.findByText(t.invalidTitle)).toBeInTheDocument();
    });

    it('shows the expired-token state', async () => {
      mockVerifyEmail.mockRejectedValue(apiError(ErrorCode.VERIFICATION_TOKEN_EXPIRED));
      renderPage();

      expect(await screen.findByText(t.expiredTitle)).toBeInTheDocument();
    });

    it('treats an already-verified email as informational with a login action', async () => {
      mockVerifyEmail.mockRejectedValue(apiError(ErrorCode.EMAIL_ALREADY_VERIFIED));
      renderPage();

      expect(await screen.findByText(t.alreadyVerifiedTitle)).toBeInTheDocument();
      expect(screen.getByText(t.goToLogin)).toHaveAttribute('href', '/login');
      expect(screen.queryByRole('button', { name: t.resend.submitBtn })).not.toBeInTheDocument();
    });

    it('shows a generic error for a backend 5xx response', async () => {
      mockVerifyEmail.mockRejectedValue(serverError());
      renderPage();

      expect(await screen.findByText(t.errorTitle)).toBeInTheDocument();
    });

    it('shows a generic error for a network failure', async () => {
      mockVerifyEmail.mockRejectedValue(new TypeError('Failed to fetch'));
      renderPage();

      expect(await screen.findByText(t.errorTitle)).toBeInTheDocument();
    });

    it('never renders the token', async () => {
      mockVerifyEmail.mockRejectedValue(apiError(ErrorCode.INVALID_VERIFICATION_TOKEN));
      const { container } = renderPage();

      await screen.findByText(t.invalidTitle);
      expect(container.textContent).not.toContain('verification-token-123');
    });
  });

  describe('resend form', () => {
    beforeEach(() => {
      mockVerifyEmail.mockRejectedValue(apiError(ErrorCode.VERIFICATION_TOKEN_EXPIRED));
    });

    const findResendButton = () =>
      screen.findByRole('button', { name: t.resend.submitBtn });

    it('is offered for a recoverable failure', async () => {
      renderPage();
      expect(await findResendButton()).toBeInTheDocument();
    });

    it('is not offered for a generic error, which a new email would not fix', async () => {
      mockVerifyEmail.mockRejectedValue(serverError());
      renderPage();

      await screen.findByText(t.errorTitle);
      expect(screen.queryByRole('button', { name: t.resend.submitBtn })).not.toBeInTheDocument();
    });

    it('rejects an invalid address without calling the API', async () => {
      renderPage();
      const button = await findResendButton();

      fireEvent.change(screen.getByLabelText(t.resend.emailLabel), {
        target: { value: 'not-an-email' },
      });
      fireEvent.click(button);

      expect(await screen.findByText(t.resend.invalidEmail)).toBeInTheDocument();
      expect(mockResend).not.toHaveBeenCalled();
    });

    it('sends a new verification email and confirms it', async () => {
      mockResend.mockResolvedValue({ code: 0, message: 'ok' } as never);
      renderPage();
      const button = await findResendButton();

      fireEvent.change(screen.getByLabelText(t.resend.emailLabel), {
        target: { value: 'student@std.iyte.edu.tr' },
      });
      fireEvent.click(button);

      await waitFor(() => expect(mockResend).toHaveBeenCalledWith('student@std.iyte.edu.tr'));
      expect(await screen.findByText(t.resend.success)).toBeInTheDocument();
    });

    it('reports a failed resend without losing the form', async () => {
      mockResend.mockRejectedValue(new ApiError('Too many requests', ResponseCodeSchema.enum.BAD_REQUEST));
      renderPage();
      const button = await findResendButton();

      fireEvent.change(screen.getByLabelText(t.resend.emailLabel), {
        target: { value: 'student@std.iyte.edu.tr' },
      });
      fireEvent.click(button);

      expect(await screen.findByText(t.resend.error)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: t.resend.submitBtn })).toBeInTheDocument();
    });
  });
});
