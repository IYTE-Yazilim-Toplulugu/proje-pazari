import { MUser } from "../models/User";
import {
    AuthContext,
    AuthLevel,
    AuthLevelSchema,
    GUEST_CONTEXT,
    Permission,
    PermissionSchema,
    Role,
    RoleSchema
} from "../models/Auth";

// UI-only guards: hasPermission, hasRole, and hasAuthLevel control what the UI renders.
// Actual authorization is enforced by the backend on every request.
const rolePermissions: Record<Role, Permission[]> = {
    [RoleSchema.enum.Guest]: [],
    [RoleSchema.enum.USER]: [
        PermissionSchema.enum.UseAccountSettings,
        PermissionSchema.enum.CreateProject,
        PermissionSchema.enum.ApplyToProject,
        PermissionSchema.enum.ManageOwnProject,
    ],
    [RoleSchema.enum.ADMIN]: Object.values(PermissionSchema.enum) as Permission[],
};

const roleAuthLevels: Record<Role, AuthLevel> = {
    [RoleSchema.enum.Guest]: AuthLevelSchema.enum.NotRestricted,
    [RoleSchema.enum.USER]: AuthLevelSchema.enum.Normal,
    [RoleSchema.enum.ADMIN]: AuthLevelSchema.enum.Highest,
};

export const getAuthContextFromUser = (user: MUser): AuthContext => {
    const role = user.role as Role;

    if (!role || !rolePermissions[role]) {
        return GUEST_CONTEXT;
    }

    return {
        isAuthenticated: true,
        userId: user.id,
        role: role,
        authLevel: roleAuthLevels[role],
        permissions: rolePermissions[role],
    };
};
