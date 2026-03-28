import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  applyToProject,
  getProject,
  getProjectApplications,
  getProjectDetail,
  getProjects,
  searchProjects,
  updateProjectApplicationStatus,
  withdrawApplication,
  type GetProjectsParams,
} from '@/lib/api';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: (params: GetProjectsParams) => [...PROJECT_KEYS.lists(), params] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROJECT_KEYS.details(), id] as const,
  applications: (id: string) => [...PROJECT_KEYS.all, 'applications', id] as const,
  search: (keyword: string, params?: GetProjectsParams) => 
    [...PROJECT_KEYS.all, 'search', keyword, params] as const,
};

export function useProjects(params?: GetProjectsParams) {
  return useQuery({
    queryKey: PROJECT_KEYS.list(params || {}),
    queryFn: () => getProjects(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProject(id: string, enabled = true) {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => getProject(id),
    enabled: enabled && !!id,
  });
}

export function useProjectDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: [...PROJECT_KEYS.detail(id), 'full'],
    queryFn: () => getProjectDetail(id),
    enabled: enabled && !!id,
  });
}

export function useSearchProjects(keyword: string, params?: GetProjectsParams) {
  return useQuery({
    queryKey: PROJECT_KEYS.search(keyword, params),
    queryFn: () => searchProjects(keyword, params),
    enabled: keyword.length > 0,
  });
}

export function useProjectApplications(projectId: string, enabled = true) {
  return useQuery({
    queryKey: PROJECT_KEYS.applications(projectId),
    queryFn: () => getProjectApplications(projectId),
    enabled: enabled && !!projectId,
  });
}

export function useApplyToProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message }: { message: string }) => applyToProject(projectId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.applications(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
    },
  });
}

export function useWithdrawApplication(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId }: { applicationId: string }) => withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.applications(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.lists() });
    },
  });
}

export function useUpdateApplicationStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: 'APPROVED' | 'REJECTED';
    }) => updateProjectApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.applications(projectId) });
    },
  });
}
