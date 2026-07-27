import { MUserSchema, UpdateUserProfileCommandSchema } from '../User';

describe('user language schemas', () => {
  it('retains the preferred language returned by the profile endpoint', () => {
    const profile = MUserSchema.parse({
      id: 'user-123',
      email: 'user@std.iyte.edu.tr',
      preferredLanguage: 'en',
    });

    expect(profile.preferredLanguage).toBe('en');
  });

  it('accepts only supported preferred languages in profile updates', () => {
    expect(
      UpdateUserProfileCommandSchema.safeParse({ preferredLanguage: 'tr' }).success,
    ).toBe(true);
    expect(
      UpdateUserProfileCommandSchema.safeParse({ preferredLanguage: 'de' }).success,
    ).toBe(false);
  });
});
