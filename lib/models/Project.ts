import { z } from 'zod';

export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

export const MProjectOwner = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  profilePictureUrl: z.string().nullable(),
});

export const MProject = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  summary: z.string(),
  status: ProjectStatusEnum,
  owner: MProjectOwner,
  applicationsCount: z.number().default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
