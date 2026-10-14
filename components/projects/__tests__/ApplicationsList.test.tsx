import { render, screen } from '@testing-library/react';

import ApplicationsList from '../ApplicationsList';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../ApplicationMessageThread', () =>
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

it('places the shared message thread beside owner review controls', () => {
  render(
    <ApplicationsList
      applications={[
        {
          applicationId: 'application-1',
          applicantId: 'applicant-1',
          applicantName: 'Applicant',
          status: 'PENDING',
        },
      ]}
      currentUserId="owner-1"
      onApprove={jest.fn()}
      onReject={jest.fn()}
    />,
  );

  expect(screen.getByTestId('message-thread')).toHaveTextContent('application-1:owner-1');
  expect(screen.getByRole('button', { name: 'approve' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'reject' })).toBeInTheDocument();
});
