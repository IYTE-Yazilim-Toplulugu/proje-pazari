import { z } from 'zod';

export const FeatureFlagSchema = z.object({
    id: z.string().optional(),
    flagKey: z.string().optional(),
    enabled: z.boolean().optional(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const ChangeFeaturePayloadSchema = z.object({
    key: z.string(),
    enabled: z.boolean().optional(),
    description: z.string().optional(),
});

// --- Type Exports ---
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export type ChangeFeaturePayload = z.infer<typeof ChangeFeaturePayloadSchema>;
