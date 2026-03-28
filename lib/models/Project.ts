import { z } from 'zod';

export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

/** Mirrors backend ProjectDetailDto */
export const MProject = z.object({
  id: z.string(),
  ownerId: z.string(),
  ownerName: z.string(),
  ownerEmail: z.string(),
  title: z.string(),
  description: z.string(),
  summary: z.string().nullable().optional(),
  applicationCount: z.number().default(0),
  status: ProjectStatusEnum,
  maxTeamSize: z.number().nullable().optional(),
  requiredSkills: z.array(z.string()).default([]),
  category: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  createdAt: z.string(),
});

export type Project = z.infer<typeof MProject>;

export const ProjectApplicationStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
]);

export type ProjectApplicationStatus = z.infer<typeof ProjectApplicationStatusEnum>;

export const MProjectApplication = z.object({
  id: z.string(),
  user: MProjectOwner,
  status: ProjectApplicationStatusEnum,
  message: z.string().nullable(),
  appliedAt: z.string().datetime(),
});

export type ProjectApplication = z.infer<typeof MProjectApplication>;

export const MProjectDetail = MProject.extend({
  requirements: z.string().nullable().optional(),
  maxApplicants: z.number().nullable().optional(),
  teamMembers: z.array(MProjectOwner).default([]),
  applications: z.array(MProjectApplication).optional(),
});

export type ProjectDetail = z.infer<typeof MProjectDetail>;

export const MProjectListResponse = z.object({
  projects: z.array(MProject),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;
