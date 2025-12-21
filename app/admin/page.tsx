'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/contexts/AuthContext';
import { PermissionSchema } from '@/lib/models/Auth';
import { useFeatures, useChangeFeature } from '@/lib/hooks/adminHooks';

// A simple component for the toggle switch
const FeatureToggle = ({ featureKey, isEnabled, onToggle, isChanging }: {
    featureKey: string;
    isEnabled: boolean;
    onToggle: (key: string, enabled: boolean) => void;
    isChanging: boolean;
}) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
        <span>{featureKey}</span>
        <button
            onClick={() => onToggle(featureKey, !isEnabled)}
            disabled={isChanging}
            style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                backgroundColor: isEnabled ? '#48bb78' : '#f56565',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
            }}
        >
            {isChanging ? 'Updating...' : (isEnabled ? 'Enabled' : 'Disabled')}
        </button>
    </div>
);

export default function AdminPage() {
    const { hasPermission, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // 1. Protection Logic: Check for permission on component mount
    useEffect(() => {
        // Wait until auth state is loaded
        if (!isAuthLoading && !hasPermission(PermissionSchema.enum.UseModerationPanel)) {
            // If user does not have permission, redirect them
            router.replace('/unauthorized'); // Or your login page
        }
    }, [isAuthLoading, hasPermission, router]);

    // 2. Data Fetching and Mutations
    const { data: features, isLoading: isFeaturesLoading, error } = useFeatures();
    const { mutate: changeFeature, isPending: isChangingFeature } = useChangeFeature();

    // Show a loading screen while checking permissions
    if (isAuthLoading || !hasPermission(PermissionSchema.enum.UseModerationPanel)) {
        return (
            <>
                <main style={{ padding: '2rem' }}>
                    <p>Verifying access...</p>
                </main>
            </>
        );
    }

    // 3. Render the main page content
    return (
        <>
            <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                <h1>Admin Panel - Feature Flags</h1>

                {isFeaturesLoading && <p>Loading feature flags...</p>}
                {error && <p style={{ color: 'red' }}>Error fetching features: {error.message}</p>}

                {features && (
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                        {Object.entries(features).map(([key, isEnabled]) => (
                            <FeatureToggle
                                key={key}
                                featureKey={key}
                                isEnabled={isEnabled}
                                onToggle={(featureKey, newEnabledState) => {
                                    changeFeature({ key: featureKey, enabled: newEnabledState });
                                }}
                                isChanging={isChangingFeature}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
