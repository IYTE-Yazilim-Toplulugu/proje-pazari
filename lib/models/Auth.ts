import { z } from 'zod';

export * from './_Execution';

// --- API Endpoint Schemas ---

export const LoginRequestSchema = z.object({
    identity: z.string().max(45),
    password: z.string().max(70),
});

export const LogoutRequestSchema = z.object({
    agent: z.string().optional(),
});

export const RegisterRequestSchema = z.object({
    name: z.string(),
    surname: z.string(),
    password: z.string().optional(),
    oauth_code: z.string().optional(),
    email: z.email(),
    phone_number: z.string().regex(/^\+\d+$/, "Phone number must start with a country code (e.g., +90) and contain no spaces."),
    birth_date: z.string().optional(),
}).refine(data => data.password != null || data.oauth_code != null, {
    message: "Either 'password' or 'oauth_code' must be provided.",
    path: ["password"],
}).refine(data => !(data.password != null && data.oauth_code != null), {
    message: "Cannot provide both 'password' and 'oauth_code'.",
    path: ["oauth_code"],
});

// OAuth registration doesn't have phone_number from provider
export const OAuthRegisterRequestSchema = RegisterRequestSchema.omit({ phone_number: true });

export const RefreshTokenRequestSchema = z.object({
    token: z.string(),
    refresh_token: z.string(),
});

// --- Status Enums ---

export const RegisterStatusSchema = z.enum({
    SendError: 0,
    OAuthVerificationError: 1,
    LowAge: 2,
    HighAge: 3,
});

export const RefreshStatusSchema = z.enum({
    Expired: 0,
});

// --- Frontend Redirect Page Schemas ---

/**
 * Status codes for the /oauth/complete frontend page.
 */
export const GStatusSchema = z.enum({
    AuthenticationError: 0,
    SessionGenerationError: 1,
    SuccessfulUserNeedsRegister: 2,
    SuccessfulJwtTokenProvided: 3,
});

/**
 * Zod schema for parsing query parameters on the /oauth/complete page.
 */
export const OAuthCompleteQuerySchema = z.object({
    status: z.preprocess(Number, GStatusSchema),
    // Fields for AuthenticationError
    code: z.string().optional(),
    // Fields for SessionGenerationError
    msg: z.string().optional(),
    // Fields for SuccessfulUserNeedsRegister
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.email().optional(),
    vcode: z.string().optional(), // This is the oauth_code for the register endpoint
    // Fields for SuccessfulJwtTokenProvided
    token: z.string().optional(),
    rtoken: z.string().optional(), // refresh token
});

/**
 * Status codes for the /register/complete frontend page.
 */
export const RegisterCompleteStatusSchema = z.enum({
    InternalError: -1,
    UserNotFound: -2,
    Success: 0,
    FailedParse: 1,
});

/**
 * Zod schema for parsing query parameters on the /register/complete page.
 */
export const RegisterCompleteQuerySchema = z.object({
    code: z.preprocess(Number, RegisterCompleteStatusSchema),
});


/**
* This schema is for form validation ONLY, not for the API call
*/
export const RegisterFormSchema = RegisterRequestSchema.safeExtend({
    passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"], // Set the error on the confirmation field
});


// --- Type Exports ---
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type OAuthRegisterRequest = z.infer<typeof OAuthRegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type OAuthCompleteQuery = z.infer<typeof OAuthCompleteQuerySchema>;
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

