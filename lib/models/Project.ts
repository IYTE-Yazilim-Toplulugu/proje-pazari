import { z } from 'zod';

// Base schema for project owner/team member
export const MProjectOwner = z.object({
    id: z.string(),
    name: z.string(),
    // Manuel try-catch yerine:
    avatarUrl: z.url().nullable().or(z.literal('')),
    // Manuel Regex yerine:
    email: z.email({ message: 'Geçersiz email formatı' }),
});

// Base project schema
export const MProject = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['OPEN', 'CLOSED']),
    // O devasa Regex yerine sadece bu:
    createdAt: z.iso.datetime({ message: 'Geçersiz tarih formatı' }),
});

// Application schema
export const MProjectApplication = z.object({
    id: z.string(),
    user: MProjectOwner,
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']),
    message: z.string().nullable(),
    // Yine sadece datetime() yeterli:
    appliedAt: z.iso.datetime(),
});

// Extended project detail schema
export const MProjectDetail = MProject.extend({
    teamMembers: z.array(MProjectOwner).default([]),
    requirements: z.string().nullable(),
    maxApplicants: z.number().nullable(),
    applications: z.array(MProjectApplication).optional(),
});

// Types...
export type ProjectOwner = z.infer<typeof MProjectOwner>;
export type Project = z.infer<typeof MProject>;
export type ProjectApplication = z.infer<typeof MProjectApplication>;
export type ProjectDetail = z.infer<typeof MProjectDetail>;
