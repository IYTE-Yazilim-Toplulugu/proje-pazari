import { z } from 'zod';

export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

export const MProject = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  applicationCount: z.number().optional(),
  status: ProjectStatusEnum.optional(),
  maxTeamSize: z.number().optional(),
  requiredSkills: z.array(z.string()).optional(),
  category: z.string().optional(),
  deadline: z.string().optional(),
  createdAt: z.string().optional(),
});

export type Project = z.infer<typeof MProject>;

export const ProjectApplicationStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN',
]);

export type ProjectApplicationStatus = z.infer<typeof ProjectApplicationStatusEnum>;

/** Mirrors backend PagedProjectsResult */
export const MProjectListResponse = z.object({
  projects: z.array(MProject).optional(),
  currentPage: z.number().optional(),
  totalPages: z.number().optional(),
  totalElements: z.number().optional(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;

/** Mirrors backend ApplicationDto. applicantEmail is optional — backend does not return it. */
export const MApplicationSchema = z.object({
  applicationId: z.string().optional(),
  projectId: z.string().optional(),
  projectTitle: z.string().optional(),
  applicantId: z.string().optional(),
  applicantName: z.string().optional(),
  applicantEmail: z.string().optional(),
  status: ProjectApplicationStatusEnum.optional(),
  createdAt: z.string().optional(),
});

export type Application = z.infer<typeof MApplicationSchema>;
export type ProjectApplication = Application;
