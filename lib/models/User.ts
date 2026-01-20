import { z } from 'zod';


/**
 * Represents a user profile.
 */
export const MUserSchema = z.object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    password: z.string().optional(),
    o_auth: z.boolean(),
    email: z.email(),
    role: z.string(),
    is_verified: z.boolean().optional(),
    language: z.string(),
    email_verification_code_expires: z.iso.datetime().nullable().optional(),
    phone_verification_code_expires: z.iso.datetime().nullable().optional(),
    sessions: z.any().nullable().optional(),
    // Profile fields
    description: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    profilePictureUrl: z.string().nullable().optional(),
    linkedinUrl: z.string().nullable().optional(),
    githubUrl: z.string().nullable().optional(),
});

// --- Type Exports ---
export type MUser = z.infer<typeof MUserSchema>;
