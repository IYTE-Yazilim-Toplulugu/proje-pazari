'use client';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authModel } from '@/lib/models';
import { useLogin } from '@/lib/hooks/authHooks';
import { LoginRequest } from '@/lib/models/Auth';

export default function LoginPage() {
    // 1. Get the login mutation function and its state
    const { mutate: login, isPending, error } = useLogin();

    // 2. Set up the form with Zod for validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(authModel.LoginRequestSchema),
    });

    // 3. This function is called on successful form validation
    const onSubmit = (data: LoginRequest) => {
        login(data);
    };

    return (
        <main className="form-container">
            <div className="form-wrapper">
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Display general API errors */}
                    {error && <p className="form-error">{error.message}</p>}

                    <div className="form-group">
                        <label htmlFor="identity">Email</label>
                        <input
                            id="identity"
                            type="email"
                            {...register('identity')}
                            aria-invalid={errors.identity ? 'true' : 'false'}
                        />
                        {errors.identity && (
                            <p className="form-error">{errors.identity.message}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            aria-invalid={errors.password ? 'true' : 'false'}
                        />
                        {errors.password && (
                            <p className="form-error">{errors.password.message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={isPending}>
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don&apos;t have an account? <Link href="/register">Register here</Link>.</p>
            </div>
        </main>
    );
}
