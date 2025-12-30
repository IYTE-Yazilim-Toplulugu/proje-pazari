import { z } from 'zod';
import Cookies from 'js-cookie';
import { refreshToken } from './auth';
import { BasicResponseSchema, DataResponseSchema, ResponseCode, ResponseCodeSchema } from '../models/Api';

// axios implementation commented out
// import axios from 'axios';
//
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// This interceptor still works because the cookie is readable by the client
// apiClient.interceptors.request.use((config) => {
//   const token = Cookies.get('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

/**
 * A custom error class to handle structured API errors.
 */
export class ApiError extends Error {
    readonly code: number;
    readonly details?: Record<string, number>;

    constructor(message: string, code: number, details?: Record<string, number>) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.details = details;
    }
}

export async function handleResponse<T extends z.ZodTypeAny>(
    response: Response,
    schema: T
): Promise<z.infer<T>> {

    if (response.status === 204) {
        return null as z.infer<T>; // No Content
    }

    if (!response.ok) {
        // Handle HTTP errors (e.g., 500 Internal Server Error)
        throw new ApiError(
            `HTTP error! status: ${response.status}`,
            response.status
        );
    }

    const json = await response.json();
    const parsedResponse = BasicResponseSchema.parse(json);

    if (parsedResponse.code !== ResponseCodeSchema.enum.Success) {
        // Handle API-level errors defined by the `code` field
        throw new ApiError(
            parsedResponse.message || 'An API error occurred.',
            response.status,
            parsedResponse.codes
        );
    }

    // On success, parse the full expected schema and return it
    return schema.parse(json);
}

/**
 * This is our central HTTP client function that wraps `fetch`.
 * Handles automatic token refreshing.
 *
 * @param endpoint The API endpoint to call.
 * @param options The fetch options.
 * @returns The fetch Response object.
 */
async function http(endpoint: string, options: RequestInit): Promise<Response> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${apiBaseUrl}${endpoint}`;

    // Add request/response logging in dev
    if (process.env.NODE_ENV === 'development') {
        console.group('API Request');
        console.log('URL:', url);
        console.log('Options:', options);
        console.groupEnd();
    }

    // Get the current access token
    const token = Cookies.get('authToken');

    const makeRequest = async (accessToken: string | undefined): Promise<Response> => {
        const headers = new Headers(options.headers);
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        if (options.body instanceof FormData) {
            headers.delete('Content-Type');
        }
        return fetch(url, { ...options, headers });
    };

    // 1. Make the initial request
    let response = await makeRequest(token);

    // 2. If the request fails with a 401, try to refresh the token
    if (response.status === 401) {
        console.log('Access token expired or did not authenticate. Attempting to refresh...');
        const currentToken = Cookies.get('authToken');
        const currentRefreshToken = Cookies.get('refreshToken');

        if (!currentToken || !currentRefreshToken) {
            if (
                !(typeof window !== 'undefined' &&
                    (
                        window.location.pathname.startsWith('/login') ||
                        window.location.pathname.startsWith('/register') ||
                        window.location.pathname.startsWith('/oauth/complete') ||
                        window.location.pathname === '/' ||
                        window.location.pathname === ''
                    )
                )
            ) {
                window.location.href = '/login'; // Force logout
            }
            return response;
        }

        try {
            // 3. Call the refresh endpoint
            const refreshResponse = await refreshToken({
                token: currentToken,
                refresh_token: currentRefreshToken,
            });

            if (refreshResponse.token && refreshResponse.refresh_token) {
                // 4. Store the new tokens using js-cookie for client-side access
                Cookies.set('authToken', refreshResponse.token, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                });
                Cookies.set('refreshToken', refreshResponse.refresh_token, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                });

                console.log('Token refreshed successfully. Retrying original request...');
                // 5. Retry the original request with the new token
                response = await makeRequest(refreshResponse.token);
            }
        } catch (error) {
            console.error('Failed to refresh token. Logging out.', error);
            // If refresh fails, the session is invalid. Clear cookies using js-cookie
            Cookies.remove('authToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            window.location.href = '/login'; // Force logout
            // We still throw the original error to let React Query know the request failed
            throw new Error('Session expired. Please log in again.');
        }
    }

    return response;
}


/**
 * Configuration for fetcher functions.
 */
type FetcherConfig<T extends z.ZodTypeAny> = {
    endpoint: string;
    dataSchema: T;
};

/**
 * The revised fetcher for GET requests.
 *
 * @param endpoint The API endpoint to call.
 * @param dataSchema The Zod schema for the expected data payload (e.g., MUserSchema).
 */
export const fetcher = async <T extends z.ZodTypeAny>(
    endpoint: string,
    dataSchema: T
): Promise<z.infer<T>> => {
    const response = await http(endpoint, { method: 'GET' }); // Assuming a proxy to your backend

    // We expect the data to be wrapped in a DataResponse
    const wrappedSchema = DataResponseSchema(dataSchema);
    const parsed = await handleResponse(response, wrappedSchema);

    if (parsed === null) {
        return null as z.infer<T>;
    }

    // @ts-ignore
    return parsed.data;
};

/**
 * Fetcher with retry logic for handling server errors.
 * Automatically retries requests on 5xx errors with exponential backoff.
 *
 * @param config The fetcher configuration containing endpoint and schema.
 * @param retries Number of retry attempts (default: 3).
 * @param backoff Initial backoff delay in milliseconds (default: 300).
 */
export async function fetcherWithRetry<T extends z.ZodTypeAny>(
    config: FetcherConfig<T>,
    retries = 3,
    backoff = 300
): Promise<z.infer<T>> {
    try {
        return await fetcher(config.endpoint, config.dataSchema);
    } catch (error) {
        if (retries > 0 && error instanceof ApiError && error.code >= 500) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetcherWithRetry(config, retries - 1, backoff * 2);
        }
        throw error;
    }
}

/**
 * A fetcher for GET requests that return the raw data object directly, not wrapped in a DataResponse.
 *
 * @param endpoint The API endpoint to call.
 * @param dataSchema The Zod schema for the expected raw data payload (e.g., MUserSchema).
 */
export const fetcherUnwrapped = async <T extends z.ZodTypeAny>(
    endpoint: string,
    dataSchema: T
): Promise<z.infer<T>> => {
    const response = await http(endpoint, { method: 'GET' });

    if (response.status === 204) {
        return null as z.infer<T>;
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Directly parse the JSON with the provided schema
    return dataSchema.parse(json);
};

type MutatorOptions = {
    arg: unknown;
};

/**
 * The revised mutator for POST, PUT, DELETE requests.
 * @param endpoint The API endpoint to call.
 * @param method The HTTP method.
 * @param responseSchema The Zod schema for the entire expected response (e.g., TokenResponseSchema).
 * @param options The request body.
 */
export const mutator = async <T extends z.ZodTypeAny>(
    endpoint: string,
    method: 'post' | 'put' | 'delete' | 'patch',
    responseSchema: T,
    options: MutatorOptions
): Promise<z.infer<T>> => {
    const response = await http(endpoint, {
        method: method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.arg),
    });

    return handleResponse(response, responseSchema);
};

/**
 * A specialized mutator for 'multipart/form-data' requests (file uploads).
 * It takes a FormData object directly as its payload.
 * @param endpoint The API endpoint to call.
 * @param method The HTTP method.
 * @param responseSchema The Zod schema for the entire expected response.
 * @param options The FormData payload.
 */
export const formDataMutator = async <T extends z.ZodTypeAny>(
    endpoint: string,
    method: 'post' | 'put' | 'patch',
    responseSchema: T,
    options: { arg: FormData }
): Promise<z.infer<T>> => {
    const response = await http(endpoint, {
        method: method.toUpperCase(),
        // NOTE: DO NOT set the 'Content-Type' header.
        // The browser does this automatically for FormData and includes the required boundary.
        body: options.arg,
    });

    // The handleResponse function you already have will work perfectly here.
    return handleResponse(response, responseSchema);
};
