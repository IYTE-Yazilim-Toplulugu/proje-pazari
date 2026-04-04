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

/**
 * Search endpoint (/api/v1/search/projects) returns a flat array with a different shape
 * than the regular projects endpoint. owner is nested, field names differ.
 */
export const MSearchProjectResult = z.object({
  id: z.string().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  summary: z.string().nullish(),
  status: ProjectStatusEnum.optional(),
  owner: z.object({
    id: z.string().nullish(),
    name: z.string().nullish(),
    email: z.string().nullish(),
  }).nullish(),
  tags: z.array(z.string()).nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  applicationsCount: z.number().nullish(),
});

export type SearchProjectResult = z.infer<typeof MSearchProjectResult>;

/** Maps the search endpoint's project shape to the standard MProject shape */
export function mapSearchResultToProject(r: SearchProjectResult): z.infer<typeof MProject> {
  return {
    id: r.id ?? undefined,
    ownerId: r.owner?.id ?? undefined,
    ownerName: r.owner?.name ?? undefined,
    ownerEmail: r.owner?.email ?? undefined,
    title: r.title ?? undefined,
    description: r.description ?? undefined,
    summary: r.summary ?? undefined,
    applicationCount: r.applicationsCount ?? undefined,
    status: r.status,
    requiredSkills: r.tags ?? undefined,
    createdAt: r.createdAt ?? undefined,
  };
}

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
