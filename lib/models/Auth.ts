import { z } from 'zod';

export * from './_Execution';

// --- API Endpoint Schemas ---

export const LoginRequestSchema = z.object({
    email: z.string().email().max(100),
    password: z.string().max(70),
});

export const LogoutRequestSchema = z.object({
    agent: z.string().optional(),
});

const createRegisterRequestBaseSchema = (t?: (key: string) => string) => z.object({
    firstName: z.string().min(2, t ? t('errors.nameMin') : 'First name too short').max(50),
    lastName: z.string().min(2, t ? t('errors.surnameMin') : 'Last name too short').max(50),
    email: z.string().email(t ? t('errors.invalidEmail') : undefined),
    password: z.string().min(8, t ? t('errors.passwordMin') : 'Password too short').optional(),
    oauth_code: z.string().optional(),
});

const createWithPasswordOrOAuthRefinements = <T extends z.ZodObject<{ password: z.ZodOptional<z.ZodString>; oauth_code: z.ZodOptional<z.ZodString> } & z.ZodRawShape>>(schema: T, t?: (key: string) => string) =>
    schema
        .refine(data => data.password != null || data.oauth_code != null, {
            message: t ? t('errors.passwordOrOauthRequired') : "Either 'password' or 'oauth_code' must be provided.",
            path: ["password"],
        })
        .refine(data => !(data.password != null && data.oauth_code != null), {
            message: t ? t('errors.passwordAndOauthConflict') : "Cannot provide both 'password' and 'oauth_code'.",
            path: ["oauth_code"],
        });

export const RegisterRequestSchema = createWithPasswordOrOAuthRefinements(createRegisterRequestBaseSchema());

// OAuth registration: same shape as regular registration, just without a password requirement
export const OAuthRegisterRequestSchema = createWithPasswordOrOAuthRefinements(createRegisterRequestBaseSchema());

export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string(),
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
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.email().optional(),
    vcode: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
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
* This schema is for form validation ONLY, not for the API call.
* Use createRegisterFormSchema(t) for translated error messages.
*/
export const RegisterFormSchema = RegisterRequestSchema.safeExtend({
    passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
});

/**
 * Factory function that creates a RegisterFormSchema with translated error messages.
 * @param t - Translation function from useTranslations('auth.register')
 */
export const createRegisterFormSchema = (t: (key: string) => string) => {
    const base = createRegisterRequestBaseSchema(t);
    return createWithPasswordOrOAuthRefinements(base, t)
        .safeExtend({ passwordConfirm: z.string() })
        .refine((data) => data.password === data.passwordConfirm, {
            message: t('errors.passwordMismatch'),
            path: ["passwordConfirm"],
        });
};


// --- Type Exports ---
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type OAuthRegisterRequest = z.infer<typeof OAuthRegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type OAuthCompleteQuery = z.infer<typeof OAuthCompleteQuerySchema>;
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

