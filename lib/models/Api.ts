import { z } from 'zod';

/**
 * Defines all possible success and error codes returned by the API.
 */
const ResponseCode = {
    SUCCESS: 0,
    BAD_REQUEST: 4,
    UNAUTHORIZED: 5,
    NOT_FOUND: 7,
    VALIDATION_ERROR: 9,
    INTERNAL_SERVER_ERROR: 10,
} as const;

export const ResponseCodeSchema = z.nativeEnum(ResponseCode);

/**
 * The base for all API responses.
 */
export const BasicResponseSchema = z.object({
    code: ResponseCodeSchema,
    codes: z.record(z.string(), z.number()).optional(),
    message: z.string().optional(),
});

/**
 * A generic response that contains a `data` payload.
 * @param T A Zod schema for the data type.
 */
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


// --- Type Exports ---
export type ResponseCode = z.infer<typeof ResponseCodeSchema>;
export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
