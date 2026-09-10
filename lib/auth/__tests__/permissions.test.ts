import { getAuthContextFromUser } from '../permissions';

describe('getAuthContextFromUser', () => {
  it('uses the canonical profile userId in the authenticated context', () => {
    const context = getAuthContextFromUser({
      userId: 'user-123',
      role: 'USER',
    });

    expect(context).toMatchObject({
      isAuthenticated: true,
      userId: 'user-123',
      role: 'USER',
    });
  });
});
