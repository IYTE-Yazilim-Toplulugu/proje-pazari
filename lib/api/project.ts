import { z } from 'zod';
import { fetcher, mutator } from './base';
import { MProject, MProjectListResponse, MApplicationSchema } from '@/lib/models';
import { apiModel } from '@/lib/models';
import type { Project, ProjectListResponse } from '@/lib/models';

export interface GetProjectsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: string;
}

export async function getProjects(params?: GetProjectsParams): Promise<ProjectListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  if (params?.status) queryParams.append('status', params.status);

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

  return fetcher(
    `/api/v1/search/projects?${queryParams.toString()}`,
    MProjectListResponse,
  );
}

/** [POST] /api/v1/projects/{projectId}/applications - Apply to a project. No request body needed. */
export async function applyToProject(projectId: string) {
  return mutator(
    `/api/v1/projects/${projectId}/applications`,
    'post',
    apiModel.BasicResponseSchema,
    { arg: null },
  );
}

/** [GET] /api/v1/projects/{projectId}/applications - Get applications for a project (owner only). */
export async function getProjectApplications(projectId: string) {
  return fetcher(
    `/api/v1/projects/${projectId}/applications`,
    z.array(MApplicationSchema),
  );
}

/** [PATCH] /api/v1/applications/{applicationId}/withdraw - Withdraw an application. */
export async function withdrawApplication(applicationId: string) {
  return mutator(
    `/api/v1/applications/${applicationId}/withdraw`,
    'patch',
    apiModel.BasicResponseSchema,
    { arg: null },
  );
}

/** [PATCH] /api/v1/applications/{applicationId}/review - Approve or reject an application. */
export async function updateProjectApplicationStatus(
  applicationId: string,
  status: 'APPROVED' | 'REJECTED',
) {
  return mutator(
    `/api/v1/applications/${applicationId}/review`,
    'patch',
    apiModel.BasicResponseSchema,
    { arg: { applicationId, status } },
  );
}
