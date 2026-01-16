'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { authModel } from '@/lib/models';
import { useRegister } from '@/lib/hooks/authHooks';
import { GStatusSchema } from '@/lib/models/Auth';

function OAuthCompleteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: registerUser } = useRegister();
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        if (processed) return;

        // Convert searchParams to an object for parsing
        const queryObject: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryObject[key] = value;
        });

        const result = authModel.OAuthCompleteQuerySchema.safeParse(queryObject);

        if (!result.success) {
            // Handle invalid query parameters
            console.error('Invalid OAuth callback params:', result.error);
            alert('An unexpected error occurred during OAuth.');
            router.push('/login');
            return;
        }

        setProcessed(true);
        const { status, name, surname, email, vcode, token, rtoken, msg, code } = result.data;

        switch (status) {
            case GStatusSchema.enum.SuccessfulJwtTokenProvided:
                // User is already registered and logged in.
                console.log('OAuth login successful, storing tokens...', token, rtoken);
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

    }, [searchParams, registerUser, router, processed]);

    return <div>Processing your authentication...</div>;
}

export default function OAuthCompletePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthCompleteContent />
        </Suspense>
    );
}
