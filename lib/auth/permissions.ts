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

const rolePermissions: Record<Role, Permission[]> = {
    [RoleSchema.enum.Guest]: [],
    [RoleSchema.enum.Shopper]: [
        PermissionSchema.enum.useStore,
        PermissionSchema.enum.Purchase,
    ],
    [RoleSchema.enum.Limited]: [PermissionSchema.enum.UseAccountSettings],
    [RoleSchema.enum.Standard]: [
        PermissionSchema.enum.UseAccountSettings,
        PermissionSchema.enum.UseCart,
        PermissionSchema.enum.useStore,
        PermissionSchema.enum.Purchase,
        PermissionSchema.enum.ReadComments,
        PermissionSchema.enum.WriteComment,
    ],
    [RoleSchema.enum.ModeratorCompany]: [
        PermissionSchema.enum.UseAccountSettings,
        PermissionSchema.enum.UseCart,
        PermissionSchema.enum.useStore,
        PermissionSchema.enum.Purchase,
        PermissionSchema.enum.ReadComments,
        PermissionSchema.enum.WriteComment,
        PermissionSchema.enum.AlterCompanyStore,
        PermissionSchema.enum.ManageCompanyForms,
    ],
    [RoleSchema.enum.ManagerCompany]: [
        PermissionSchema.enum.UseAccountSettings,
        PermissionSchema.enum.UseCart,
        PermissionSchema.enum.useStore,
        PermissionSchema.enum.Purchase,
        PermissionSchema.enum.ReadComments,
        PermissionSchema.enum.WriteComment,
        PermissionSchema.enum.AlterCompanyStore,
        PermissionSchema.enum.ManageCompanyForms,
        PermissionSchema.enum.AlterCompanyRestrictedInfo,
    ],
    [RoleSchema.enum.Moderator]: [
        PermissionSchema.enum.UseAccountSettings,
        PermissionSchema.enum.UseCart,
        PermissionSchema.enum.useStore,
        PermissionSchema.enum.Purchase,
        PermissionSchema.enum.ReadComments,
        PermissionSchema.enum.WriteComment,
        PermissionSchema.enum.UseModerationPanel,
    ],
    [RoleSchema.enum.Admin]: Object.values(PermissionSchema.enum),
};

const roleAuthLevels: Record<Role, AuthLevel> = {
    [RoleSchema.enum.Guest]: AuthLevelSchema.enum.NotRestricted,
    [RoleSchema.enum.Shopper]: AuthLevelSchema.enum.Normal,
    [RoleSchema.enum.Limited]: AuthLevelSchema.enum.Normal,
    [RoleSchema.enum.Standard]: AuthLevelSchema.enum.Normal,
    [RoleSchema.enum.ModeratorCompany]: AuthLevelSchema.enum.Normal,
    [RoleSchema.enum.ManagerCompany]: AuthLevelSchema.enum.High,
    [RoleSchema.enum.Moderator]: AuthLevelSchema.enum.Higher,
    [RoleSchema.enum.Admin]: AuthLevelSchema.enum.Highest,
};

/**
 * Constructs the full AuthContext from a user object (or just a role).
 * This is the central mapping logic.
 * @param user The user object from the API, must contain a role.
 * @returns A complete AuthContext object with permissions and authLevel.
 */
export const getAuthContextFromUser = (user: MUser): AuthContext => {
    // Assuming MUser.role is a string that matches a value in the Role enum
    const role = user.role as Role;

    if (!role || !rolePermissions[role]) {
        // Fallback to guest if role is unknown or missing
        return GUEST_CONTEXT;
    }

    return {
        isAuthenticated: true,
        userId: user.id,
        role: role,
        authLevel: roleAuthLevels[role],
        permissions: rolePermissions[role],
        // Spreading the rest of the user object into the context might be useful
        // ...user
    };
};
