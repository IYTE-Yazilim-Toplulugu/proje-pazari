import { z } from 'zod';

export * from './_Execution';

// --- API Endpoint Schemas ---

export const LoginRequestSchema = z.object({
    email: z.string().email().max(45),
    password: z.string().max(70),
});

export const LogoutRequestSchema = z.object({
    refreshToken: z.string(),
});

export const RegisterRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().optional(),
});

export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string(),
});

// --- Status Enums ---

export const RegisterStatusSchema = z.enum({
    SendError: 0,
    LowAge: 2,
    HighAge: 3,
});

export const RefreshStatusSchema = z.enum({
    Expired: 0,
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
export const RegisterFormSchema = RegisterRequestSchema.extend({
    passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
});

/**
 * Factory function that creates a RegisterFormSchema with translated error messages.
 * @param t - Translation function from useTranslations('auth.register')
 */
export const createRegisterFormSchema = (t: (key: string) => string) =>
    RegisterRequestSchema.extend({
        passwordConfirm: z.string(),
        email: z.email().refine(
            (val) => val.endsWith('@std.iyte.edu.tr') || val.endsWith('@iyte.edu.tr'),
            { message: t('errors.invalidEmailDomain') }
        ),
        password: z.string()
            .min(8, { message: t('errors.passwordMin') })
            .refine((val) => /[a-z]/.test(val), { message: t('errors.passwordLowercase') })
            .refine((val) => /[A-Z]/.test(val), { message: t('errors.passwordUppercase') })
            .refine((val) => /\d/.test(val), { message: t('errors.passwordDigit') })
            .refine((val) => /[^A-Za-z0-9]/.test(val), { message: t('errors.passwordSpecial') }),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: t('errors.passwordMismatch'),
        path: ['passwordConfirm'],
    });


// --- Type Exports ---
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

