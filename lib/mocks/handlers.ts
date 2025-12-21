import { http, HttpResponse } from 'msw';

import { Role, AuthLevel, Permission, RoleSchema } from '@/lib/models/Auth';

const API_URL = '/api';

export const handlers = [
    // Mock for GET /user/get (successful response)
    http.get(`${API_URL}/user/get`, () => {
        return HttpResponse.json({
            code: 0,
            data: {
                id: 1,
                company_id: 101,
                works_for_company: true,
                name: 'John',
                surname: 'Doe',
                // NOTE: A real API would NEVER send the password field. It's omitted here for security.
                oauth: false,
                payment_service_id: 'cus_aBcDeFgHiJkLmN',
                email: 'john.doe@example.com',
                new_email: null,
                email_verification_code: null,
                phone_number: '+905551234567',
                new_phone_number: null,
                phone_verification_code: null,
                role: RoleSchema.enum.Standard,
                verification_code: null,
                verification_code_created: null,
                register_date: '2024-05-10T14:48:00.000Z',
                limit_expire_date: null,
                birth_date: '1990-01-15T00:00:00.000Z',
                favourite_companies: [101, 205],
                cart: null,
            },
        });
    }),

    // Mock for GET /user/get (successful response)
    http.get(`${API_URL}/admin/feature/all`, () => {
        return HttpResponse.json({
            code: 0,
            data: {
                Feed: true,
                Company: true,
                Cart: true,
                Payment: true,
                Comment: true,
                Form: true,
            },
        });
    }),

    // Mock for POST /auth/login
    http.post(`${API_URL}/auth`, () => {
        return HttpResponse.json({
            code: 0,
            token: 'mock-jwt-token',
            refresh_token: 'mock-refresh-token',
            expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            user_verified: true,
        });
    }),

    http.get(`${API_URL}/cart`, () => {
        return HttpResponse.json({
            code: 0,
            data: {
                company_name: 'Test Company',
                company_slug: 'test-company',
                company_icon: 'icon-url',
                products: [],
                conditioned_campaigns: [],
                campaigns: [],
                items: [{ product_id: 1, amount: 1, note: 'Test item' }],
                categories: [],
                products_from_campaign: [],
                total: 19.99,
            },
        });
    }),

    http.put(`${API_URL}/cart/append`, () => {
        return HttpResponse.json({
            code: 0,
            data: {
                company_name: 'Test Company',
                company_slug: 'test-company',
                company_icon: 'icon-url',
                products: [],
                conditioned_campaigns: [],
                campaigns: [],
                items: [
                    { product_id: 1, amount: 1, note: 'Test item' },
                    { product_id: 2, amount: 2, note: 'Another item' }
                ],
                categories: [],
                products_from_campaign: [],
                total: 59.99,
            },
        });
    }),

    http.patch(`${API_URL}/cart/remove`, () => {
        return HttpResponse.json({
            code: 0,
            message: 'Items removed successfully'
        });
    }),

    http.patch(`${API_URL}/cart/clear`, () => {
        return HttpResponse.json({
            code: 0,
            message: 'Cart cleared successfully'
        });
    }),
];
