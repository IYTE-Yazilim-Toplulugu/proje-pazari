"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/contexts/AuthContext";
import { PermissionSchema } from "@/lib/models/Auth";
import { useFeatures, useChangeFeature } from "@/lib/hooks/adminHooks";

// A simple component for the toggle switch
const FeatureToggle = ({
  featureKey,
  isEnabled,
  onToggle,
  isChanging,
}: {
  featureKey: string;
  isEnabled: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  isChanging: boolean;
}) => (
  <div className="flex justify-between items-center p-3 border-b border-border last:border-b-0">
    <span className="text-text-primary">{featureKey}</span>
    <button
      onClick={() => onToggle(featureKey, !isEnabled)}
      disabled={isChanging}
      className={[
        "px-4 py-2 rounded text-white font-medium transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isEnabled
          ? "bg-success hover:opacity-90"
          : "bg-error hover:bg-error-dark",
      ].join(" ")}
    >
      {isChanging ? "Updating..." : isEnabled ? "Enabled" : "Disabled"}
    </button>
  </div>
);

export default function AdminPage() {
  const { hasPermission, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 1. Protection Logic: Check for permission on component mount
  useEffect(() => {
    // Wait until auth state is loaded
    if (
      !isAuthLoading &&
      !hasPermission(PermissionSchema.enum.UseModerationPanel)
    ) {
      // If user does not have permission, redirect them
      router.replace("/unauthorized"); // Or your login page
    }
  }, [isAuthLoading, hasPermission, router]);

  // 2. Data Fetching and Mutations
  const { data: features, isLoading: isFeaturesLoading, error } = useFeatures();
  const { mutate: changeFeature, isPending: isChangingFeature } =
    useChangeFeature();

  if (
    isAuthLoading ||
    !hasPermission(PermissionSchema.enum.UseModerationPanel)
  ) {
    return (
      <main className="p-8">
        <p className="text-(--color-text-secondary)">Verifying access...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Admin Panel — Feature Flags
      </h1>

      {isFeaturesLoading && (
        <p className="text-(--color-text-secondary)">
          Loading feature flags...
        </p>
      )}
      {error && (
        <p className="text-error">Error fetching features: {error.message}</p>
      )}

      {features && (
        <div className="border border-border rounded-lg overflow-hidden bg-background-elevated">
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
  );
}
