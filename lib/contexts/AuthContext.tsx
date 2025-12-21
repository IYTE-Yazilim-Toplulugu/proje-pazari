import React, { createContext, useContext, useMemo } from 'react';

import { useSession } from '../hooks/authHooks';
import {
    AuthContext as AuthContextData,
    AuthLevel,
    GUEST_CONTEXT,
    Permission,
    Role,
} from '../models/Auth';

type AuthProviderType = {
    isLoading: boolean;
    user: AuthContextData;
    role: Role;
    authLevel: AuthLevel;
    hasPermission: (permission: Permission) => boolean;
    hasRole: (role: Role) => boolean;
    hasAuthLevel: (requiredLevel: AuthLevel) => boolean;
};

const AuthContext = createContext<AuthProviderType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading } = useSession();

    const value = useMemo(() => {
        const sessionUser = user || GUEST_CONTEXT;

        /**
         * Checks if the user's permission list includes the required permission.
         * @param permission The permission to check for.
         * @returns `true` if the user has the permission.
         */
        const hasPermission = (permission: Permission): boolean => {
            // The "Administrator" permission grants all other permissions.
            if (sessionUser.permissions.includes('Administrator')) {
                return true;
            }
            return sessionUser.permissions.includes(permission);
        };

        /**
         * Checks if the user's role matches the specified role.
         * @param role The role to check against.
         * @returns `true` if the user has the specified role.
         */
        const hasRole = (role: Role): boolean => {
            return sessionUser.role === role;
        };

        /**
         * Checks if the user's authorization level is sufficient.
         * This is used for data access checks (e.g., [R1], [RW3]).
         * @param requiredLevel The minimum level required for an action.
         * @returns `true` if the user's level is greater than or equal to the required level.
         */
        const hasAuthLevel = (requiredLevel: AuthLevel): boolean => {
            return sessionUser.authLevel >= requiredLevel;
        };

        return {
            isLoading,
            user: sessionUser,
            role: sessionUser.role,
            authLevel: sessionUser.authLevel,
            hasPermission,
            hasRole,
            hasAuthLevel,
        };
    }, [user, isLoading]);

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
