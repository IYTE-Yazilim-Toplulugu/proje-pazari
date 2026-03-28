import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject, searchProjects, type GetProjectsParams } from '@/lib/api';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: (params: GetProjectsParams) => [...PROJECT_KEYS.lists(), params] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROJECT_KEYS.details(), id] as const,
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

export function useSearchProjects(keyword: string, params?: GetProjectsParams) {
  return useQuery({
    queryKey: PROJECT_KEYS.search(keyword, params),
    queryFn: () => searchProjects(keyword, params),
    enabled: keyword.length > 0,
  });
}