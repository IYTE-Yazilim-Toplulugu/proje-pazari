import { z } from 'zod';

/**
 * Defines all possible success and error codes returned by the API.
 */
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
