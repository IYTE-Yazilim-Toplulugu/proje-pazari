import { fetcher, mutator } from './base';
import { adminModel, apiModel } from '../models';

/**
 * [GET] /api/v1/admin/feature-flags
 * Fetches all feature flags.
 */
export const getFeatures = () =>
    fetcher('/api/v1/admin/feature-flags', adminModel.FeatureListSchema);

/**
 * [PUT] /api/v1/admin/feature-flags/:key
 * Changes the state of a single feature flag.
 */
export const changeFeature = ({ key, enabled }: adminModel.ChangeFeaturePayload) =>
    mutator(
        `/api/v1/admin/feature-flags/${key}`,
        'put',
        apiModel.BasicResponseSchema,
        { arg: { enabled } }
    );

/**
 * [POST] /api/v1/admin/feature-flags/clean
 * Cleans or resets unused feature flags.
 * **BROKEN: this endpoint does not exist on the backend yet.**
 */
export const cleanFeatures = () =>
    mutator(
        '/api/v1/admin/feature-flags/clean',
        'post',
        apiModel.BasicResponseSchema,
        { arg: {} }
    );
