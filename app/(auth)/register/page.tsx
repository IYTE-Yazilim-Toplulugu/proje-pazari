// app/register/page.tsx
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { authModel } from '@/lib/models';
import { useRegister } from '@/lib/hooks/authHooks';
import { RegisterForm } from '@/lib/models/Auth';

export default function RegisterPage() {
    const t = useTranslations("auth.register");
    const { mutate: registerUser, isPending, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(authModel.RegisterFormSchema),
    }); 

    const onSubmit = (data: RegisterForm) => {
        const { passwordConfirm, ...apiData } = data;
        registerUser(apiData);
    };

    return (
        <main className="form-container">
            <div className="form-wrapper">
                <h2>{t("createAccount")}</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {error && (
                        <div className="form-error mb-4" role="alert">
                             <strong>Error: </strong>
                             {error.message || t('errors.generic')}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">{t('name')}</label>
                            <input
                                id="firstName"
                                type="text"
                                {...register('firstName')}
                                className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                                placeholder={t('placeholders.name')}
                            />
                            {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">{t('surname')}</label>
                            <input
                                id="lastName"
                                type="text"
                                {...register('lastName')}
                                className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                                placeholder={t('placeholders.surname')}
                            />
                            {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="email" className="form-label">{t('email')}</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                            placeholder={t('placeholders.email')}
                        />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="password" className="form-label">{t('password')}</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                            placeholder={t('placeholders.password')}
                        />
                        {errors.password && <p className="form-error">{errors.password.message}</p>}
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="passwordConfirm" className="form-label">{t('confirmPassword')}</label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            {...register('passwordConfirm')}
                            className={`form-input ${errors.passwordConfirm ? 'form-input-error' : ''}`}
                            placeholder={t('placeholders.password')}
                        />
                        {errors.passwordConfirm && <p className="form-error">{errors.passwordConfirm.message}</p>}
                    </div>

                    <button type="submit" className="form-button mt-6" disabled={isPending}>
                        {isPending ? t('creatingAccount') : t('submit')}
                    </button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                    {t('hasAccount')}{' '}
                    <Link href="/login" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">
                        {t('loginLink')}
                    </Link>
                </p>
            </div>
        </main>
    );
}