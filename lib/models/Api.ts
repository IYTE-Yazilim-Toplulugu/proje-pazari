import { z } from 'zod';

/**
 * Coarse HTTP-category response code returned by the API in the `code` field.
 *
 * Values must stay in parity with the backend `ResponseCode` enum (0-10); the
 * names here are the frontend's own labels. Missing a value makes
 * `z.nativeEnum().parse()` throw on otherwise-valid responses.
 */
const ResponseCode = {
    SUCCESS: 0,
    EMAIL_SENT: 1, // backend: NO_CONTENT
    REGISTERED_NEEDS_VERIFY: 2, // backend: CREATED
    ACCEPTED: 3,
    BAD_REQUEST: 4,
    UNAUTHORIZED: 5,
    FORBIDDEN: 6,
    NOT_FOUND: 7,
    CONFLICT: 8,
    VALIDATION_ERROR: 9,
    INTERNAL_SERVER_ERROR: 10,
} as const;

export const ResponseCodeSchema = z.nativeEnum(ResponseCode);

/**
 * Stable, granular machine-readable error identifier returned in the
 * `errorCode` field of error responses. Mirrors the backend `ErrorCode` enum.
 *
 * Clients should branch on this rather than on `code` (too coarse) or
 * `message` (display-only). Treat these strings as a public API contract.
 */
export const ErrorCode = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MALFORMED_REQUEST: 'MALFORMED_REQUEST',
    MISSING_PARAMETER: 'MISSING_PARAMETER',
    INVALID_ARGUMENT: 'INVALID_ARGUMENT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    ACCESS_DENIED: 'ACCESS_DENIED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
    APPLICATION_NOT_FOUND: 'APPLICATION_NOT_FOUND',
    FLAGGED_CONTENT_NOT_FOUND: 'FLAGGED_CONTENT_NOT_FOUND',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
    VERIFICATION_TOKEN_EXPIRED: 'VERIFICATION_TOKEN_EXPIRED',
    INVALID_VERIFICATION_TOKEN: 'INVALID_VERIFICATION_TOKEN',
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    FILE_VALIDATION_FAILED: 'FILE_VALIDATION_FAILED',
    FILE_STORAGE_ERROR: 'FILE_STORAGE_ERROR',
    ILLEGAL_USER_STATE: 'ILLEGAL_USER_STATE',
    ILLEGAL_APPLICATION_STATE: 'ILLEGAL_APPLICATION_STATE',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const ErrorCodeSchema = z.nativeEnum(ErrorCode);

export const BasicResponseSchema = z.object({
    code: ResponseCodeSchema,
    // Accept any string so an errorCode the frontend doesn't know yet never
    // crashes parsing — branching logic falls back to a generic message.
    errorCode: z.string().optional(),
    codes: z.record(z.string(), z.number()).optional(),
    message: z.string().optional(),
    timestamp: z.string().optional(),
});

export const DataResponseSchema = <T extends z.ZodTypeAny>(T: T) =>
    BasicResponseSchema.extend({
        data: T.optional(),
    });

/**
 * A generic response for paginated data.
 * @param T A Zod schema for the data type.
 */
export const PagedDataResponseSchema = <T extends z.ZodTypeAny>(T: T) =>
    DataResponseSchema(T).extend({
        page_size: z.number().int().optional(),
        page: z.number().int().optional(),
    });

export const LoginResultSchema = z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
});

export const LoginResponseSchema = DataResponseSchema(LoginResultSchema);

/**
 * The response schema for authentication endpoints (login + refresh).
 * Matches backend's RefreshTokenResult shape.
 */
export const TokenResponseSchema = DataResponseSchema(
    z.object({
        userId: z.string().optional(),
        email: z.string().optional(),
        role: z.string().optional(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
    }),
);

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
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type LoginResult = z.infer<typeof LoginResultSchema>;
export type RefreshResult = z.infer<typeof RefreshResultSchema>;
