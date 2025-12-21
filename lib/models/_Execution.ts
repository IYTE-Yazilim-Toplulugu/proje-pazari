import { z } from 'zod';

/**
 * Defines all possible granular permissions in the system.
 * These are the building blocks for roles.
 */
export const PermissionSchema = z.enum({
    // Basic Actions
    Authorization: 'Authorization', // Placeholder, likely managed by role
    useStore: 'UseStore',
    UseAccountSettings: 'UseAccountSettings',
    UseCart: 'UseCart',
    Purchase: 'Purchase',
    ReadComments: 'ReadComments',
    WriteComment: 'WriteComment',

    // Company-level Actions
    AlterCompanyStore: 'AlterCompanyStore',
    ManageCompanyForms: 'ManageCompanyForms',
    AlterCompanyRestrictedInfo: 'AlterCompanyRestrictedInfo',

    // DropShake (DS) Admin/Moderator Actions
    UseModerationPanel: 'UseModerationPanel',
    Administrator: 'Administrator',
});
export type Permission = z.infer<typeof PermissionSchema>;

/**
 * Defines the user roles. The hierarchy (e.g., ModeratorCompany includes Standard)
 * should be resolved on the backend, which then provides a flat list of all
 * applicable permissions to the client.
 */
export const RoleSchema = z.enum({
    Guest: 'Guest',
    Shopper: 'Shopper',
    Limited: 'Limited',
    Standard: 'Standard',
    ModeratorCompany: 'ModeratorCompany',
    ManagerCompany: 'ManagerCompany',
    Moderator: 'Moderator',
    Admin: 'Admin',
});
export type Role = z.infer<typeof RoleSchema>;

/**
 * Defines the JSON data restriction levels.
 * The numeric values are important for comparison (e.g., Higher > Normal).
 */
export const AuthLevelSchema = z.enum({
    NotRestricted: 0,
    Normal: 1,
    High: 2,
    Higher: 3,
    Highest: 4,
});
export type AuthLevel = z.infer<typeof AuthLevelSchema>;

/**
 * This is the main object representing the user's session and permissions.
 * It should be fetched from the backend after a user authenticates.
 */
export const AuthContextSchema = z.object({
    isAuthenticated: z.boolean(),
    userId: z.number().optional(),
    role: RoleSchema,
    authLevel: AuthLevelSchema,
    permissions: z.array(PermissionSchema),
});
export type AuthContext = z.infer<typeof AuthContextSchema>;

// We can define a default "Guest" context for when no user is logged in.
export const GUEST_CONTEXT: AuthContext = {
    isAuthenticated: false,
    role: RoleSchema.enum.Guest,
    authLevel: AuthLevelSchema.enum.NotRestricted,
    permissions: [],
};
