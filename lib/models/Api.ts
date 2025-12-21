import { z } from 'zod';

/**
 * Defines all possible success and error codes returned by the API.
 */
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
 * The response schema for authentication endpoints.
 */
export const TokenResponseSchema = BasicResponseSchema.extend({
    token: z.string().optional(),
    refresh_token: z.string().optional(),
    expires: z.iso.datetime().optional(),
    user_verified: z.boolean().optional(),
});


// --- Type Exports ---
export type ResponseCode = z.infer<typeof ResponseCodeSchema>;
export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
