import { fetcher, mutator } from './base';
import { adminModel, apiModel } from '../models';

/**
 * [GET] /admin/feature/all
 * Fetches all feature flags.
 * This uses the revised `fetcher` which correctly unwraps the DataResponse.
 */
export const getFeatures = () =>
    fetcher('/admin/feature/all', adminModel.FeatureListSchema);

/**
 * [POST] /admin/feature/change/:key
 * Changes the state of a single feature flag.
 * @param payload An object containing the feature `key` and its new `enabled` state.
 */
export const changeFeature = ({ key, enabled }: adminModel.ChangeFeaturePayload) =>
    mutator(
        `/admin/feature/change/${key}?enabled=${enabled}`, // `enabled` is now a query parameter
        'post',
        apiModel.BasicResponseSchema, // Uses the standardized BasicResponse schema
        { arg: {} } // The request body is now empty
    );

/**
 * [POST] /admin/feature/clean
 * Cleans or resets unused feature flags.
 */
export const cleanFeatures = () =>
    mutator(
        '/admin/feature/clean',
        'post',
        apiModel.BasicResponseSchema, // Uses the standardized BasicResponse schema
        { arg: {} } // No request body
    );
