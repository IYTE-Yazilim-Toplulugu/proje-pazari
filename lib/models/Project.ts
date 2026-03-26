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

export const MProjectListResponse = z.object({
  projects: z.array(MProject).optional(),
  currentPage: z.number().optional(),
  totalPages: z.number().optional(),
  totalElements: z.number().optional(),
});

export type ProjectListResponse = z.infer<typeof MProjectListResponse>;

export const MApplicationSchema = z.object({
  applicationId: z.string().optional(),
  projectId: z.string().optional(),
  projectTitle: z.string().optional(),
  applicantId: z.string().optional(),
  applicantName: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']).optional(),
  createdAt: z.string().optional(),
});

export type Application = z.infer<typeof MApplicationSchema>;
