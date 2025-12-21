// app/register/page.tsx
'use client';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { authModel } from '@/lib/models';
import { useRegister } from '@/lib/hooks/authHooks';
import { RegisterForm } from '@/lib/models/Auth';

export default function RegisterPage() {
    const { mutate: registerUser, isPending, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(authModel.RegisterFormSchema),
    });

    const onSubmit = (data: RegisterForm) => {
        // We don't send `passwordConfirm` to the API
        const { passwordConfirm, ...apiData } = data;

        // Format birth_date to UTC datetime string if it exists
        if (apiData.birth_date) {
            // Convert date string (YYYY-MM-DD) to datetime string (YYYY-MM-DDTHH:MM:SSZ)
            const birthDate = new Date(apiData.birth_date);
            // Set time to midnight UTC
            birthDate.setUTCHours(0, 0, 0, 0);
            // Format as ISO string in UTC
            apiData.birth_date = birthDate.toISOString();
        }

        registerUser(apiData);
    };

    return (
        <main className="form-container">
            <div className="form-wrapper">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {error && <p className="form-error">{error.message}</p>}

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" {...register('name')} />
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Surname</label>
                        <input id="surname" {...register('surname')} />
                        {errors.surname && <p className="form-error">{errors.surname.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" {...register('email')} />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input id="phone_number" type="tel" {...register('phone_number')} />
                        {errors.phone_number && <p className="form-error">{errors.phone_number.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="birth_date">Birthdate</label>
                        <input id="birth_date" type="date" {...register('birth_date')} />
                        {errors.birth_date && <p className="form-error">{errors.birth_date.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" {...register('password')} />
                        {errors.password && <p className="form-error">{errors.password.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="passwordConfirm">Confirm Password</label>
                        <input id="passwordConfirm" type="password" {...register('passwordConfirm')} />
                        {errors.passwordConfirm && <p className="form-error">{errors.passwordConfirm.message}</p>}
                    </div>

                    <button type="submit" disabled={isPending}>
                        {isPending ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p>Already have an account? <a href="/login">Login here</a>.</p>
            </div>
        </main>
    );
}
