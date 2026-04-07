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

let isRefreshing = false;
type QueueEntry = { resolve: (token: string) => void; reject: (err: unknown) => void };
const refreshQueue: QueueEntry[] = [];

function drainQueue(token: string) {
    refreshQueue.splice(0).forEach(({ resolve }) => resolve(token));
}

function rejectQueue(err: unknown) {
    refreshQueue.splice(0).forEach(({ reject }) => reject(err));
}

/**
 * A custom error class to handle structured API errors.
 */
export class ApiError extends Error {
    readonly code: ResponseCode;
    readonly details?: Record<string, number>;

    constructor(message: string, code: ResponseCode, details?: Record<string, number>) {
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
        const json = await response.json().catch(() => null);
        throw new ApiError(
            json?.message || `HTTP error! status: ${response.status}`,
            json?.code ?? response.status
        );
    }

    const json = await response.json();
    const parsedResponse = BasicResponseSchema.parse(json);

    const SUCCESS_CODES: ResponseCode[] =[ResponseCodeSchema.enum.SUCCESS, ResponseCodeSchema.enum.REGISTERED_NEEDS_VERIFY, ResponseCodeSchema.enum.EMAIL_SENT];
    if (!SUCCESS_CODES.includes(parsedResponse.code)) {
        // Handle API-level errors defined by the `code` field
        throw new ApiError(
            parsedResponse.message || 'An API error occurred.',
            parsedResponse.code,
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
 * @param signal Optional AbortSignal for request cancellation.
 * @returns The fetch Response object.
 */
async function http(endpoint: string, options: RequestInit, signal?: AbortSignal): Promise<Response> {
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
        return fetch(url, { ...options, headers, signal });
    };

    // 1. Make the initial request
    let response = await makeRequest(token);

    // 2. If the request fails with a 401, try to refresh the token
    if (response.status === 401) {
        console.log('Access token expired or did not authenticate. Attempting to refresh...');
        const currentToken = Cookies.get('authToken');
        const currentRefreshToken = Cookies.get('refreshToken');

        // --- LOCALE EXTRACTION AND PATH NORMALIZATION ---
        let locale = 'tr'; // Default fallback
        let unlocalizedPath = '/';

        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            const pathParts = pathname.split('/').filter(Boolean);

            // Extract locale from the first segment if it exists
            if (pathParts[0] === 'en' || pathParts[0] === 'tr') {
                locale = pathParts[0];
            }

            // Remove the locale prefix to normalize the path for checking
            unlocalizedPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
        }

        // Check if the user is already on a public/auth route
        const isPublicRoute = typeof window !== 'undefined' && (
            unlocalizedPath.startsWith('/login') ||
            unlocalizedPath.startsWith('/register') ||
            unlocalizedPath.startsWith('/oauth/complete') ||
            unlocalizedPath === '/'
        );

        if (!currentToken || !currentRefreshToken) {
            if (!isPublicRoute && typeof window !== 'undefined') {
                window.location.href = `/${locale}/login`; // Redirect with proper locale
            }
            return response;
        }

        // 3. If a refresh is already in flight, queue this request and wait
        if (isRefreshing) {
            const newToken = await new Promise<string>((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            });
            response = await makeRequest(newToken);
            return response;
        }

        isRefreshing = true;

        try {
            // 4. Call the refresh endpoint (only one request will reach here)
            const refreshResponse = await refreshToken({
                refreshToken: currentRefreshToken,
            });

            if (refreshResponse.data?.accessToken && refreshResponse.data?.refreshToken) {
                // 5. Store the new tokens using js-cookie for client-side access
                Cookies.set('authToken', refreshResponse.data.accessToken, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                });
                Cookies.set('refreshToken', refreshResponse.data.refreshToken, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                });

                console.log('Token refreshed successfully. Retrying original request...');
                drainQueue(refreshResponse.data.accessToken);
                // 6. Retry the original request with the new token
                response = await makeRequest(refreshResponse.data.accessToken);
            }
        } catch (error) {
            console.error('Failed to refresh token. Logging out.', error);
            rejectQueue(error);
            // If refresh fails, the session is invalid. Clear cookies using js-cookie
            Cookies.remove('authToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            
            if (typeof window !== 'undefined') {
                window.location.href = `/${locale}/login`; // Redirect with proper locale on refresh failure
            }
            
            // We still throw the original error to let React Query know the request failed
            throw new Error('Session expired. Please log in again.');
        } finally {
            isRefreshing = false;
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
    signal?: AbortSignal;
};

/**
 * The revised fetcher for GET requests.
 *
 * @param endpoint The API endpoint to call.
 * @param dataSchema The Zod schema for the expected data payload (e.g., MUserSchema).
 * @param signal Optional AbortSignal for request cancellation.
 */
export const fetcher = async <T extends z.ZodTypeAny>(
    endpoint: string,
    dataSchema: T,
    signal?: AbortSignal
): Promise<z.infer<T>> => {
    const response = await http(endpoint, { method: 'GET' }, signal); // Assuming a proxy to your backend

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
        return await fetcher(config.endpoint, config.dataSchema, config.signal);
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
 * @param signal Optional AbortSignal for request cancellation.
 */
export const fetcherUnwrapped = async <T extends z.ZodTypeAny>(
    endpoint: string,
    dataSchema: T,
    signal?: AbortSignal
): Promise<z.infer<T>> => {
    const response = await http(endpoint, { method: 'GET' }, signal);

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
 * @param signal Optional AbortSignal for request cancellation.
 */
export const mutator = async <T extends z.ZodTypeAny>(
    endpoint: string,
    method: 'post' | 'put' | 'delete' | 'patch',
    responseSchema: T,
    options: MutatorOptions,
    signal?: AbortSignal
): Promise<z.infer<T>> => {
    const response = await http(endpoint, {
        method: method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.arg),
    }, signal);

    return handleResponse(response, responseSchema);
};

/**
 * A specialized mutator for 'multipart/form-data' requests (file uploads).
 * It takes a FormData object directly as its payload.
 * @param endpoint The API endpoint to call.
 * @param method The HTTP method.
 * @param responseSchema The Zod schema for the entire expected response.
 * @param options The FormData payload.
 * @param signal Optional AbortSignal for request cancellation.
 */
export const formDataMutator = async <T extends z.ZodTypeAny>(
    endpoint: string,
    method: 'post' | 'put' | 'patch',
    responseSchema: T,
    options: { arg: FormData },
    signal?: AbortSignal
): Promise<z.infer<T>> => {
    const response = await http(endpoint, {
        method: method.toUpperCase(),
        // NOTE: DO NOT set the 'Content-Type' header.
        // The browser does this automatically for FormData and includes the required boundary.
        body: options.arg,
    }, signal);

    // The handleResponse function you already have will work perfectly here.
    return handleResponse(response, responseSchema);
};
