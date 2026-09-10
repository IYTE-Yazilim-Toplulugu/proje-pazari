import { MUserSchema, UpdateUserProfileCommandSchema } from '../User';

describe('user profile schemas', () => {
  it('retains the canonical userId returned by the profile endpoint', () => {
    const profile = MUserSchema.parse({
      userId: 'user-123',
      email: 'user@std.iyte.edu.tr',
    });

    expect(profile.userId).toBe('user-123');
    expect(profile).not.toHaveProperty('id');
  });

  it('retains the preferred language returned by the profile endpoint', () => {
    const profile = MUserSchema.parse({
      userId: 'user-123',
      email: 'user@std.iyte.edu.tr',
      preferredLanguage: 'en',
    });

    expect(profile.preferredLanguage).toBe('en');
  });

  it('parses a profile whose preferred language is null', () => {
    const profile = MUserSchema.parse({
      userId: 'user-123',
      email: 'user@std.iyte.edu.tr',
      preferredLanguage: null,
    });

    expect(profile.preferredLanguage).toBeNull();
  });

  it('drops an unsupported preferred language instead of failing the profile', () => {
    const profile = MUserSchema.parse({
      userId: 'user-123',
      email: 'user@std.iyte.edu.tr',
      preferredLanguage: 'en-US',
    });

    expect(profile.preferredLanguage).toBeUndefined();
    expect(profile.email).toBe('user@std.iyte.edu.tr');
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
