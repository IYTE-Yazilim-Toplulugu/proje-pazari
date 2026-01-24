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
    language: z.enum(['tr', 'en']).optional().default('tr'),
    email_verification_code_expires: z.iso.datetime().nullable().optional(),
    phone_verification_code_expires: z.iso.datetime().nullable().optional(),
    sessions: z.any().nullable().optional(),
});

// --- Type Exports ---
export type MUser = z.infer<typeof MUserSchema>;
