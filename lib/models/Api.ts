import { z } from 'zod';

export const ResponseCodeSchema = z.enum({
    Success: 0,
    NoContent: 1,
    Created: 2,
    Accepted: 3,
    BadRequest: 4,
    Unauthorized: 5,
    Forbidden: 6,
    NotFound: 7,
    Conflict: 8,
    ValidationError: 9,
    InternalServerError: 10,
});

export const BasicResponseSchema = z.object({
    code: ResponseCodeSchema,
    codes: z.record(z.string(), z.number()).optional(),
    message: z.string().optional(),
    timestamp: z.string().optional(),
});

export const DataResponseSchema = <T extends z.ZodTypeAny>(T: T) =>
    BasicResponseSchema.extend({
        data: T.optional(),
    });

export const LoginResultSchema = z.object({
    userId: z.string(),
    email: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    role: z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().optional(),
});

export const LoginResponseSchema = DataResponseSchema(LoginResultSchema);

export const RefreshResultSchema = z.object({
    userId: z.string(),
    email: z.string(),
    role: z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
});

export const RefreshResponseSchema = DataResponseSchema(RefreshResultSchema);

// --- Type Exports ---
export type ResponseCode = z.infer<typeof ResponseCodeSchema>;
export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type LoginResult = z.infer<typeof LoginResultSchema>;
export type RefreshResult = z.infer<typeof RefreshResultSchema>;
