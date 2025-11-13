/**
 * @file use-roles.ts
 * @description Roles React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services/roles.service';
import type { 
  RolesQueryParams,
  CreateRolesRequest,
  UpdateRolesRequest
} from '../types/roles.types';

/**
 * 목록 조회 hook
 */
export function useRoles(params?: RolesQueryParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: ({ signal }) => rolesService.listRoles(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useRolesById(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: ({ signal }) => rolesService.getRoles(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateRoles(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRolesRequest) => 
      rolesService.createRoles(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateRoles(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRolesRequest }) =>
      rolesService.updateRoles(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteRoles(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesService.deleteRoles(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
