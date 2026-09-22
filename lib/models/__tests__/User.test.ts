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

  it('parses a profile whose preferred language is null', () => {
    const profile = MUserSchema.parse({
      id: 'user-123',
      email: 'user@std.iyte.edu.tr',
      preferredLanguage: null,
    });

    expect(profile.preferredLanguage).toBeNull();
  });

  it('drops an unsupported preferred language instead of failing the profile', () => {
    const profile = MUserSchema.parse({
      id: 'user-123',
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

it('preserves canonical project summaries embedded in a user profile', () => {
  const profile = MUserSchema.parse({
    id: 'user-123',
    projects: [{
      projectId: 'project-123',
      projectName: 'Profile project',
      description: 'A project owned by this user',
      status: 'OPEN',
      createdAt: '2026-09-22T12:00:00',
    }],
  });
  expect(profile.projects?.[0]).toMatchObject({
    projectId: 'project-123',
    projectName: 'Profile project',
  });
});
