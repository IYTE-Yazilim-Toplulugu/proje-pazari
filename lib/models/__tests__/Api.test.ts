import { TokenResponseSchema } from '../Api';

describe('TokenResponseSchema', () => {
  const validResponse = {
    code: 0,
    data: {
      userId: 'user-123',
      email: 'user@std.iyte.edu.tr',
      role: 'USER',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    },
  };

  it('accepts an authentication response containing an access token', () => {
    expect(TokenResponseSchema.parse(validResponse)).toEqual(validResponse);
  });

  it('rejects an authentication response without an access token', () => {
    const responseWithoutAccessToken = {
      ...validResponse,
      data: {
        userId: validResponse.data.userId,
        email: validResponse.data.email,
        role: validResponse.data.role,
        refreshToken: validResponse.data.refreshToken,
      },
    };

    expect(TokenResponseSchema.safeParse(responseWithoutAccessToken).success).toBe(false);
  });
});

it.each(['accessToken', 'refreshToken'])('rejects missing or empty %s', (field) => {
  for (const value of [undefined, '']) {
    expect(TokenResponseSchema.safeParse({code: 0, data: {
      accessToken: 'access', refreshToken: 'refresh', [field]: value,
    }}).success).toBe(false);
  }
});
