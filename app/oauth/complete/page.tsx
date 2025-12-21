'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { authModel } from '@/lib/models';
import { useRegister, useLogin } from '@/lib/hooks/authHooks'; // Assuming login can be initiated from here
import { GStatusSchema } from '@/lib/models/Auth';

const OAuthCompletePage = () => {
    const router = useRouter();
    const { mutate: registerUser } = useRegister();
    // You might need a way to log in without a password using a one-time code
    // For now, we'll focus on the registration part.

    useEffect(() => {
        if (!router.isReady) return;

        const result = authModel.OAuthCompleteQuerySchema.safeParse(router.query);

        if (!result.success) {
            // Handle invalid query parameters
            console.error('Invalid OAuth callback params:', result.error);
            alert('An unexpected error occurred during OAuth.');
            router.push('/login');
            return;
        }

        const { status, name, surname, email, vcode, token, rtoken, msg, code } = result.data;

        switch (status) {
            case GStatusSchema.enum.SuccessfulJwtTokenProvided:
                // User is already registered and logged in.
                console.log('OAuth login successful, storing tokens...');
                // Store token and rtoken here, invalidate session, redirect.
                alert('Successfully logged in!');
                router.push('/dashboard');
                break;

            case GStatusSchema.enum.SuccessfulUserNeedsRegister:
                // User is new. We have their info. Redirect to a final registration step.
                // Or, you can automatically register them here.
                alert('Please complete your registration.');
                // @ts-expect-error I handled like to
                registerUser({ name, surname, email, oauth_code: vcode, phone_number: '' /* Prompt for phone */ });
                break;

            case GStatusSchema.enum.SessionGenerationError:
                alert(`Session Error: ${msg}`);
                router.push('/login');
                break;

            case GStatusSchema.enum.AuthenticationError:
                alert(`Authentication Error, code: ${code}`);
                router.push('/login');
                break;
        }

    }, [router.isReady, router.query, registerUser, router]);

    return <div>Processing your authentication...</div>;
};

export default OAuthCompletePage;
