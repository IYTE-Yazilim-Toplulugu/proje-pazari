import { render, screen } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import ApplicationsPage from '../page';
import { useSession } from '@/lib/hooks/authHooks';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@/lib/hooks/authHooks', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/projects/ApplicationMessageThread', () =>
  function MessageThread({
    applicationId,
    currentUserId,
  }: {
    applicationId: string;
    currentUserId?: string;
  }) {
    return <div data-testid="message-thread">{`${applicationId}:${currentUserId}`}</div>;
  },
);

it('places the shared message thread in the applicant application card', () => {
  (useSession as jest.Mock).mockReturnValue({
    data: { isAuthenticated: true, userId: 'applicant-1' },
    isLoading: false,
  });
  (useQuery as jest.Mock).mockReturnValue({
    data: {
      applications: [
        {
          applicationId: 'application-1',
          projectTitle: 'Project',
          status: 'PENDING',
          createdAt: '2026-09-10T12:00:00',
        },
      ],
    },
    isLoading: false,
    isError: false,
  });

  render(<ApplicationsPage />);

  expect(screen.getByTestId('message-thread')).toHaveTextContent(
    'application-1:applicant-1',
  );
});
