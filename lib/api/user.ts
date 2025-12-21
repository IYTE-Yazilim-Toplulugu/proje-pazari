import { z } from 'zod';

import { fetcher, fetcherUnwrapped, mutator } from './base';
import { apiModel, userModel } from '../models';

/** [GET] /user/get - Returns the current user. */
export const getCurrentUser = () => fetcherUnwrapped('/user/get', userModel.MUserSchema);

/** [GET] /user/:userId - Returns a user by a given id. */
export const getUserById = (userId: number, fields?: string[]) =>
    fetcher(`/user/${userId}?fields=${fields?.join(',') ?? ''}`, userModel.MUserSchema);

/** [GET] /user/list - Gets all users with pagination and sorting. */
export const listUsers = (params: { page?: number, pageSize?: number, sby?: string, fields?: string[] }) =>
    fetcher(`/user/list?page=${params.page ?? ''}&pageSize=${params.pageSize ?? ''}&sby=${params.sby ?? ''}&fields=${params.fields?.join(',') ?? ''}`, z.array(userModel.MUserSchema));

/** [POST] /user/create - Creates a new user manually. */
export const createUser = (payload: userModel.MUser) =>
    mutator('/user/create', 'post', apiModel.DataResponseSchema(z.number()), { arg: payload });

/** [PATCH] /user/update - Updates the user. */
export const updateUser = (payload: Partial<userModel.MUser>) =>
    mutator('/user/update', 'patch', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /user/update/language - Updates the user's language. */
export const updateUserLanguage = (language: string) =>
    mutator(`/user/update/language?language=${language}`, 'post', apiModel.BasicResponseSchema, { arg: {} });

/** [DELETE] /user/delete - Deletes the user. */
export const deleteUser = (id?: number) =>
    mutator(`/user/delete?id=${id ?? ''}`, 'delete', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /user/verify/phone - Verifies the new phone number. */
export const verifyPhone = (code: string) =>
    mutator(`/user/verify/phone?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /user/verify/email - Verifies the new email. */
export const verifyEmail = (code: string) =>
    mutator(`/user/verify/email?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });
