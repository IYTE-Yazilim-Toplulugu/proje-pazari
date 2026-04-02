import { z } from 'zod';


/**
 * Matches backend's UserProfileDTO.
 * `role` is optional — it comes from the token (RefreshTokenResult), not the profile endpoint.
 */
export const MUserSchema = z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),
    description: z.string().nullable().optional(),
    profilePictureUrl: z.string().nullable().optional(),
    linkedinUrl: z.string().nullable().optional(),
    githubUrl: z.string().nullable().optional(),
    joinedAt: z.string().optional(),
    projectsCreated: z.number().optional(),
    applicationsSubmitted: z.number().optional(),
    projects: z.array(z.any()).optional(),
    // Not returned by profile endpoint — populated from token if needed
    role: z.string().optional(),
});

export const UpdateUserProfileCommandSchema = z.object({
    userId: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    description: z.string().optional(),
    linkedinUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    preferredLanguage: z.string().optional(),
});

export type MUser = z.infer<typeof MUserSchema>;
export type UpdateUserProfileCommand = z.infer<typeof UpdateUserProfileCommandSchema>;
