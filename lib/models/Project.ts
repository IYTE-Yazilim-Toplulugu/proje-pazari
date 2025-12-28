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

export const MProjectListResponse = z.object({
  projects: z.array(MProject),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;
