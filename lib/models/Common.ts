import { z } from 'zod';

// --- Enums ---

export const MRateLevelSchema = z.enum({
    VeryLow: 0,
    Low: 1,
    Normal: 2,
    High: 3,
    VeryHigh: 4,
});

export const SortTypeSchema = z.enum({
    Relevant: 0,
    Newest: 1,
    Nearest: 2,
    Popular: 3,
    HigherRank: 4,
});

export const ImageUploadErrorCodeSchema = z.enum({
    FileAlreadyExists: 0,
    InvalidImageSize: 1,
    UnsupportedFileType: 2,
    InvalidImageDimensions: 3,
});

export const MFormTypeSchema = z.enum({
    Support: 0,
    Report: 1,
    Contact: 2,
});

// --- Schemas ---

/**
 * Represents rating information.
 */
export const MRateInfoSchema = z.object({
    price_rate: z.number(),
    service_rate: z.number(),
    product_rate: z.number(),
});

/**
 * Defines sorting parameters.
 * Note: This class is used as a query field and serialized as ‘[sort_by],[descending]’.
 * Example: '0,false’ means sort by relevant in ascending order.
 */
export const SortByModelSchema = z.object({
    sort_by: z.number().int(),
    descending: z.boolean(),
});

/**
 * Defines a numeric range for querying.
 * Note: This class is used as a query field and serialized.
 * Examples: ‘(1,2)’, ‘(1,)’, ‘(,2)’, ‘(,)’
 */
export const RangeSchema = z.object({
    min: z.number().optional(),
    max: z.number().optional(),
});

/**
 * Represents a file node in storage.
 */
export const StorageNodeSchema = z.object({
    path: z.string(),
    identifier: z.string(),
    file_size: z.number(),
});

/**
 * Represents a form submission (Support, Report, Contact).
 */
export const MFormSchema = z.object({
    company_id: z.number().optional(),
    slug: z.string(),
    email: z.email().optional(),
    user_id: z.number().optional(),
    subject: z.string().max(100).regex(new RegExp('^[\\p{Letter}\\-\\s.\',_;()!?]+$', 'u')),
    content: z.string().max(400).regex(new RegExp('^[\\p{Letter}\\-\\s.\',_;()!?]+$', 'u')),
    type: MFormTypeSchema,
    is_solved: z.boolean(),
    solve_date: z.iso.datetime().optional(),
    create_date: z.iso.datetime(),
}).refine(data => data.email != null || data.user_id != null, {
    message: "Either 'email' or 'user_id' field must be filled.",
});

/**
 * Schema for the POST /form/send request body.
 */
export const SendFormPayloadSchema = z.object({
    email: z.email().optional(),
    company_slug: z.string().optional(),
    subject: z.string().max(100).regex(new RegExp("^[\\p{Letter}\\-\\s.',_;()!?]+$", 'u')),
    content: z.string().max(400).regex(new RegExp("^[\\p{Letter}\\-\\s.',_;()!?]+$", 'u')),
    type: MFormTypeSchema,
});

/**
 * Schema for the request body to filter forms.
 */
export const FormFilterRequestSchema = z.object({
    page: z.number().int().min(1),
    page_size: z.number().int().min(1).max(50),
    solved_from: z.iso.datetime().optional(),
    solved_to: z.iso.datetime().optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
    type: MFormTypeSchema.optional(),
    company_id: z.number().optional(),
    solved: z.boolean().optional(),
});

/**
 * Schema for the POST /form/respond/:id request body.
 */
export const RespondToFormPayloadSchema = z.object({
    subject: z.string().max(120).regex(new RegExp("^[\\p{Letter}\\-\\s.',_;()!?]+$", 'u')).optional(),
    content: z.string().max(600).regex(new RegExp("^[\\p{Letter}\\-\\s.',_;()!?]+$", 'u')).optional(),
    is_solved: z.boolean().optional(),
}).refine(data => (data.subject && data.content) || (!data.subject && !data.content), {
    message: "Subject and content must either both be provided or both be omitted.",
});

// --- Interfaces ---

/**
 * Represents a shared interface for items that have stock.
 */
export const IStockableSchema = z.object({
    stock_count: z.number().min(0).nullable(),
    open_to_sale: z.boolean().default(true),
});

// --- Types ---
export type MRateLevel = z.infer<typeof MRateLevelSchema>;
export type SortType = z.infer<typeof SortTypeSchema>;
export type ImageUploadErrorCode = z.infer<typeof ImageUploadErrorCodeSchema>;
export type MFormType = z.infer<typeof MFormTypeSchema>;
export type MRateInfo = z.infer<typeof MRateInfoSchema>;
export type SortByModel = z.infer<typeof SortByModelSchema>;
export type Range = z.infer<typeof RangeSchema>;
export type StorageNode = z.infer<typeof StorageNodeSchema>;
export type MForm = z.infer<typeof MFormSchema>;
export type SendFormPayload = z.infer<typeof SendFormPayloadSchema>;
export type FormFilterRequest = z.infer<typeof FormFilterRequestSchema>;
export type RespondToFormPayload = z.infer<typeof RespondToFormPayloadSchema>;
export type IStockable = z.infer<typeof IStockableSchema>;
