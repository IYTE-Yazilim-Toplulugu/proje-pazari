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
  id: z.string().nullish(),
  ownerId: z.string().nullish(),
  ownerName: z.string().nullish(),
  ownerEmail: z.string().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  summary: z.string().nullish(),
  applicationCount: z.number().nullish(),
  status: ProjectStatusEnum.optional(),
  maxTeamSize: z.number().nullish(),
  requiredSkills: z.array(z.string()).optional(),
  category: z.string().nullish(),
  deadline: z.string().nullish(),
  createdAt: z.string().nullish(),
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
  projects: z.array(MProject),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;

/** Mirrors backend ApplicationDto. applicantEmail is optional — backend does not return it. */
export const MApplicationSchema = z.object({
  applicationId: z.string(),
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
