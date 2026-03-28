import { z } from 'zod';

/** Mirrors backend UserProfileDTO */
export const MUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    fullName: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    profilePictureUrl: z.string().nullable().optional(),
    linkedinUrl: z.string().nullable().optional(),
    githubUrl: z.string().nullable().optional(),
    joinedAt: z.string().nullable().optional(),
    projectsCreated: z.number().optional(),
    applicationsSubmitted: z.number().optional(),
    role: z.string(),
});

export type MUser = z.infer<typeof MUserSchema>;
