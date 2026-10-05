import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import ApplicationMessageThread from '../ApplicationMessageThread';
import { useApplicationMessages, useSendApplicationMessage } from '@/lib/hooks/chatHooks';

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => `chat.${key}`,
}));

jest.mock('@/lib/hooks/chatHooks', () => ({
  useApplicationMessages: jest.fn(),
  useSendApplicationMessage: jest.fn(),
}));

const useMessagesMock = useApplicationMessages as jest.Mock;
const useSendMock = useSendApplicationMessage as jest.Mock;

const mutation = {
  mutateAsync: jest.fn(),
  isPending: false,
  isError: false,
};

describe('ApplicationMessageThread', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mutation.isPending = false;
    mutation.isError = false;
    useMessagesMock.mockReturnValue({
      data: { content: [], page: 0, size: 100, totalElements: 0, totalPages: 0 },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    useSendMock.mockReturnValue(mutation);
    mutation.mutateAsync.mockResolvedValue(undefined);
  });

  it('shows loading and empty states', () => {
    useMessagesMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });
    const { rerender } = render(
      <ApplicationMessageThread applicationId="app-1" currentUserId="applicant-1" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('chat.loading');

    useMessagesMock.mockReturnValue({
      data: { content: [], page: 0, size: 100, totalElements: 0, totalPages: 0 },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    rerender(<ApplicationMessageThread applicationId="app-1" currentUserId="applicant-1" />);
    expect(screen.getByText('chat.empty')).toBeInTheDocument();
  });

  it('renders applicant and owner messages as escaped plain text', () => {
    const unsafeText = '<img src=x onerror=alert(1) />';
    useMessagesMock.mockReturnValue({
      data: {
        content: [
          {
            id: 'm1',
            applicationId: 'app-1',
            senderId: 'applicant-1',
            body: unsafeText,
            createdAt: '2026-09-10T12:00:00',
          },
          {
            id: 'm2',
            applicationId: 'app-1',
            senderId: 'owner-1',
            body: 'Owner response',
            createdAt: '2026-09-10T12:01:00',
          },
        ],
        page: 0,
        size: 100,
        totalElements: 2,
        totalPages: 1,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { container, rerender } = render(
      <ApplicationMessageThread applicationId="app-1" currentUserId="applicant-1" />,
    );

    expect(screen.getByText(unsafeText)).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
    expect(within(screen.getByTestId('message-m1')).getByText('chat.you')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('message-m2')).getByText('chat.participant'),
    ).toBeInTheDocument();

    rerender(<ApplicationMessageThread applicationId="app-1" currentUserId="owner-1" />);
    expect(
      within(screen.getByTestId('message-m1')).getByText('chat.participant'),
    ).toBeInTheDocument();
    expect(within(screen.getByTestId('message-m2')).getByText('chat.you')).toBeInTheDocument();
  });

  it('shows a retryable non-participant or loading error state', () => {
    const refetch = jest.fn();
    useMessagesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    render(<ApplicationMessageThread applicationId="app-1" currentUserId="unrelated-1" />);

    expect(screen.getByRole('alert')).toHaveTextContent('chat.loadError');
    fireEvent.click(screen.getByRole('button', { name: 'chat.retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('sends trimmed text, clears the composer, and exposes pending state', async () => {
    const { rerender } = render(
      <ApplicationMessageThread applicationId="app-1" currentUserId="applicant-1" />,
    );
    const composer = screen.getByRole('textbox', { name: 'chat.inputLabel' });
    fireEvent.change(composer, { target: { value: '  hello  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'chat.send' }));

    await waitFor(() => expect(mutation.mutateAsync).toHaveBeenCalledWith('hello'));
    await waitFor(() => expect(composer).toHaveValue(''));

    mutation.isPending = true;
    rerender(<ApplicationMessageThread applicationId="app-1" currentUserId="applicant-1" />);
    expect(screen.getByRole('button', { name: 'chat.sending' })).toBeDisabled();
  });
});
