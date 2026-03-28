import { z } from 'zod';

export const ResponseCodeSchema = z.enum({
    Success: 0,
    InternalError: 1,
    InvalidRequest: 2,
    Unauthenticated: 3,
    Unauthorized: 4,
    NotFound: 5,
    Exists: 6,
    Forbidden: 7,
    ServiceSpecified: 8,
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
