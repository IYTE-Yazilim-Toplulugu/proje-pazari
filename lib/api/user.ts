import { z } from 'zod';

import { fetcher, mutator } from './base';
import { apiModel, userModel } from '../models';

// ============================================================================
// ÇALIŞAN ENDPOINT'LER (RESTful standartlarına ve Backend'e göre güncellendi)
// ============================================================================

/** [GET] /api/v1/users/me - Returns the current user profile. */
export const getCurrentUser = () =>
    fetcher('/api/v1/users/me', userModel.MUserSchema);

/** [GET] /api/v1/users/:userId - Returns a user by a given id. */
export const getUserById = (userId: number, fields?: string[]) =>
    fetcher(`/api/v1/users/${userId}${fields ? `?fields=${fields.join(',')}` : ''}`, userModel.MUserSchema);

/** [GET] /api/v1/users - Gets all users with pagination and sorting. */
export const listUsers = (params: { page?: number, pageSize?: number, sby?: string, fields?: string[] }) => {
    // Parametreleri URLSearchParams ile daha temiz oluşturmak çok daha güvenlidir:
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.pageSize !== undefined) query.append('pageSize', params.pageSize.toString());
    if (params.sby) query.append('sby', params.sby);
    if (params.fields) query.append('fields', params.fields.join(','));
    
    return fetcher(`/api/v1/users?${query.toString()}`, z.array(userModel.MUserSchema));
}

/** [PUT] /api/v1/users/me - Updates the user profile. */
export const updateUser = (payload: userModel.UpdateUserProfileCommand) =>
    mutator('/api/v1/users/me', 'put', apiModel.BasicResponseSchema, { arg: payload });


// ============================================================================
// DİKKAT: BACKEND'DE HENÜZ OLMAYANLAR VEYA UYUMSUZ OLANLAR!
// ============================================================================

/** [POST] /api/v1/users - Creates a new user manually. (TABLODA 'NO SUCH ENDPOINT' DİYOR) */
export const createUser = (payload: userModel.MUser) =>
    mutator('/api/v1/users', 'post', apiModel.DataResponseSchema(z.number()), { arg: payload });

/** [PUT] /api/v1/users/me/language - Updates the user's language. (TABLODA 'NO SUCH ENDPOINT' DİYOR) */
export const updateUserLanguage = (language: 'tr' | 'en') =>
    mutator(`/api/v1/users/me/language`, 'put', apiModel.BasicResponseSchema, { arg: { language } });

/** [DELETE] /api/v1/users/:id - Deletes the user. (Durumu meçhul) */
export const deleteUser = (id?: number) =>
    mutator(`/api/v1/users/${id ?? 'me'}`, 'delete', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /api/v1/users/verify/phone - Verifies the new phone number. (Durumu meçhul) */
export const verifyPhone = (code: string) =>
    mutator(`/api/v1/users/verify/phone?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /api/v1/users/verify/email - Verifies the new email. (Durumu meçhul) */
export const verifyEmail = (code: string) =>
    mutator(`/api/v1/users/verify/email?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });
