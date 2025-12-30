import { z } from 'zod';

// Base schema for project owner/team member
export const MProjectOwner = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable().refine(
    (val) => {
      if (val === null) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format' }
  ),
  email: z.string().regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: 'Invalid email format' }
  ),
});

// Base project schema
export const MProject = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'CLOSED']),
  createdAt: z.string().refine(
    (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(val),
    { message: 'Invalid ISO 8601 datetime format' }
  ),
});

// Application schema (used within ProjectDetail)
export const MProjectApplication = z.object({
  id: z.string(),
  user: MProjectOwner,
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']),
  message: z.string().nullable(),
  appliedAt: z.string().refine(
    (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(val),
    { message: 'Invalid ISO 8601 datetime format' }
  ),
});

// Extended project detail schema
export const MProjectDetail = MProject.extend({
  teamMembers: z.array(MProjectOwner).default([]),
  requirements: z.string().nullable(),
  maxApplicants: z.number().nullable(),
  applications: z.array(MProjectApplication).optional(),
});

// Inferred TypeScript types
export type ProjectOwner = z.infer<typeof MProjectOwner>;
export type Project = z.infer<typeof MProject>;
export type ProjectApplication = z.infer<typeof MProjectApplication>;
export type ProjectDetail = z.infer<typeof MProjectDetail>;