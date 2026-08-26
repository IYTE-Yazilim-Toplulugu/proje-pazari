import { z } from 'zod';
import { MProject } from './Project';


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
    projects: z.array(MProject).optional(),
    // Nullable: the backend column is nullable, so rows that predate the default
    // serialize as null. Unsupported values are dropped rather than failing the
    // whole profile parse, which would take the session query down with it.
    preferredLanguage: z.enum(['tr', 'en']).nullable().optional().catch(undefined),
    // Not returned by profile endpoint — populated from token if needed
    role: z.string().optional(),
});

export const UpdateUserProfileCommandSchema = z.object({
    userId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    description: z.string().optional(),
    linkedinUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    preferredLanguage: z.enum(['tr', 'en']).optional(),
});

export type MUser = z.infer<typeof MUserSchema>;
export type UpdateUserProfileCommand = z.infer<typeof UpdateUserProfileCommandSchema>;
