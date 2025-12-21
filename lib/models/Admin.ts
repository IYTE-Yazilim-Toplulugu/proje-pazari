import { z } from 'zod';

// --- Zod Schemas for Type Safety ---
export const FeatureListSchema = z.record(z.string(), z.boolean());

export const ChangeFeaturePayloadSchema = z.object({
    key: z.string(),
    enabled: z.boolean(),
})

export const SuccessResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});

// --- Type Definitions ---
export type FeatureList = z.infer<typeof FeatureListSchema>;
export type ChangeFeaturePayload = z.infer<typeof ChangeFeaturePayloadSchema>;
