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

/** Mirrors backend ApplicationDto */
export const MProjectApplication = z.object({
  applicationId: z.string(),
  projectId: z.string(),
  projectTitle: z.string().nullable().optional(),
  applicantId: z.string(),
  applicantName: z.string(),
  applicantEmail: z.string(),
  status: ProjectApplicationStatusEnum,
  createdAt: z.string().nullable().optional(),
});

export type ProjectApplication = z.infer<typeof MProjectApplication>;

/** Mirrors backend PagedProjectsResult */
export const MProjectListResponse = z.object({
  projects: z.array(MProject),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;
