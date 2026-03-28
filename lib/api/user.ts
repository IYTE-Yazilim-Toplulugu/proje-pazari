import { fetcher, mutator } from './base';
import { apiModel, userModel } from '../models';

/** [GET] /api/v1/users/me - Returns the current user. */
export const getCurrentUser = () => fetcher('/api/v1/users/me', userModel.MUserSchema);

/** [GET] /api/v1/users/:userId - Returns a user by id. */
export const getUserById = (userId: string) =>
    fetcher(`/api/v1/users/${userId}`, userModel.MUserSchema);

/** [PUT] /api/v1/users/me - Updates the current user's profile. */
export const updateUser = (payload: Partial<Pick<userModel.MUser, 'firstName' | 'lastName' | 'description' | 'linkedinUrl' | 'githubUrl'>>) =>
    mutator('/api/v1/users/me', 'put', apiModel.BasicResponseSchema, { arg: payload });

/** [DELETE] /api/v1/users/me - Deletes the current user's account. */
export const deleteUser = () =>
    mutator('/api/v1/users/me', 'delete', apiModel.BasicResponseSchema, { arg: {} });
