import { z } from 'zod';

export const PermissionSchema = z.enum({
    UseAccountSettings: 'UseAccountSettings',
    CreateProject: 'CreateProject',
    ApplyToProject: 'ApplyToProject',
    ManageOwnProject: 'ManageOwnProject',
    AdminPanel: 'AdminPanel',
});
export type Permission = z.infer<typeof PermissionSchema>;

export const RoleSchema = z.enum({
    Guest: 'Guest',
    USER: 'USER',
    ADMIN: 'ADMIN',
});
export type Role = z.infer<typeof RoleSchema>;

export const AuthLevelSchema = z.enum({
    NotRestricted: 0,
    Normal: 1,
    High: 2,
    Highest: 3,
});
export type AuthLevel = z.infer<typeof AuthLevelSchema>;

export const AuthContextSchema = z.object({
    isAuthenticated: z.boolean(),
    userId: z.string().optional(),
    role: RoleSchema,
    authLevel: AuthLevelSchema,
    permissions: z.array(PermissionSchema),
});
export type AuthContext = z.infer<typeof AuthContextSchema>;

export const GUEST_CONTEXT: AuthContext = {
    isAuthenticated: false,
    role: RoleSchema.enum.Guest,
    authLevel: AuthLevelSchema.enum.NotRestricted,
    permissions: [],
};
