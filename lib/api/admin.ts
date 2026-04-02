import { z } from 'zod';
import { fetcher, mutator } from './base';
import { adminModel, apiModel } from '../models';

/**
 * [GET] /api/v1/admin/feature-flags
 * Fetches all feature flags.
 */
export const getFeatures = () =>
    fetcher('/api/v1/admin/feature-flags', z.array(adminModel.FeatureFlagSchema));

/**
 * [PUT] /api/v1/admin/feature-flags/{key}
 * Changes the state of a single feature flag.
 */
export const changeFeature = ({ key, enabled, description }: adminModel.ChangeFeaturePayload) =>
    mutator(
        `/api/v1/admin/feature-flags/${key}`,
        'put',
        apiModel.BasicResponseSchema,
        { arg: { enabled, description } }
    );
