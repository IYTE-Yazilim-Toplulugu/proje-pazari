import { z } from 'zod';

import { fetcher, mutator } from './base';
import { apiModel, userModel, MApplicationSchema } from '../models';

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

/** Updates the authenticated user's persisted language preference. */
export const updateUserLanguage = (preferredLanguage: 'tr' | 'en') =>
    updateUser({ preferredLanguage });

// Response schema for GET /api/v1/users/me/applications
const PagedApplicationsResponseSchema = z.object({
    applications: z.array(MApplicationSchema),
    currentPage: z.number().optional(),
    totalPages: z.number().optional(),
    totalElements: z.number().optional(),
});

/** [GET] /api/v1/users/me/applications - Returns paged applications submitted by the authenticated user. */
export const getMyApplications = () =>
    fetcher('/api/v1/users/me/applications', PagedApplicationsResponseSchema);


// ============================================================================
// DİKKAT: BACKEND'DE HENÜZ OLMAYANLAR VEYA UYUMSUZ OLANLAR!
// ============================================================================

/** [POST] /api/v1/users - Creates a new user manually. (TABLODA 'NO SUCH ENDPOINT' DİYOR) */
export const createUser = (payload: userModel.MUser) =>
    mutator('/api/v1/users', 'post', apiModel.DataResponseSchema(z.number()), { arg: payload });

/** [DELETE] /api/v1/users/me - Deletes the authenticated user. */
export const deleteUser = () =>
    mutator('/api/v1/users/me', 'delete', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /api/v1/users/verify/phone - Verifies the new phone number. (Durumu meçhul) */
export const verifyPhone = (code: string) =>
    mutator(`/api/v1/users/verify/phone?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });

/** [POST] /api/v1/users/verify/email - Verifies the new email. (Durumu meçhul) */
export const verifyEmail = (code: string) =>
    mutator(`/api/v1/users/verify/email?code=${code}`, 'post', apiModel.BasicResponseSchema, { arg: {} });
