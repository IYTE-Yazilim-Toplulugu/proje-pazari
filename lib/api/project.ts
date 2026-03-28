import { fetcher } from './base';
import { MProject, MProjectListResponse } from '@/lib/models';
import type { Project, ProjectListResponse } from '@/lib/models';

export interface GetProjectsParams {
  page?: number;
  size?: number;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export async function getProjects(params?: GetProjectsParams): Promise<ProjectListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  return fetcher(
    `/api/v1/projects?${queryParams.toString()}`,
    MProjectListResponse,
  );
}

export async function getProject(id: string): Promise<Project> {
  return fetcher(
    `/api/v1/projects/${id}`,
    MProject,
  );
}

export async function getProjectDetail(id: string): Promise<Project> {
  return fetcher(
    `/api/v1/projects/${id}`,
    MProject,
  );
}

export async function searchProjects(keyword: string, params?: GetProjectsParams): Promise<ProjectListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('q', keyword);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.status) queryParams.append('status', params.status);

  return fetcher(
    `/api/v1/search/projects?${queryParams.toString()}`,
    MProjectListResponse,
  );
}

export async function applyToProject(projectId: string, message: string): Promise<BasicResponse> {
  return mutator(
    `/api/v1/projects/${projectId}/applications`,
    'post',
    BasicResponseSchema,
    { arg: { message } },
  );
}

export async function getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
  return fetcher(
    `/api/v1/projects/${projectId}/applications`,
    z.array(MProjectApplication),
  );
}

export async function withdrawApplication(applicationId: string): Promise<BasicResponse> {
  return mutator(
    `/api/v1/applications/${applicationId}`,
    'delete',
    BasicResponseSchema,
    { arg: {} },
  );
}

export async function updateProjectApplicationStatus(
  applicationId: string,
  status: 'APPROVED' | 'REJECTED',
): Promise<BasicResponse> {
  return mutator(
    `/api/v1/applications/${applicationId}`,
    'patch',
    BasicResponseSchema,
    { arg: { status } },
  );
}
