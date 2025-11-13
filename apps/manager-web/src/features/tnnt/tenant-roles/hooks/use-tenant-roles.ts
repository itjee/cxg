/**
 * @file use-tenant-roles.ts
 * @description 테넌트 역할 관리 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantRolesService } from '../services';
import type {
  TenantRoleQueryParams,
  CreateTenantRoleRequest,
  UpdateTenantRoleRequest,
} from '../types';

/**
 * Query Key Factory
 */
export const tenantRolesKeys = {
  all: ['tenant-roles'] as const,
  lists: () => [...tenantRolesKeys.all, 'list'] as const,
  list: (params?: TenantRoleQueryParams) =>
    [...tenantRolesKeys.lists(), params] as const,
  detail: (id: string) => [...tenantRolesKeys.all, 'detail', id] as const,
};

/**
 * 목록 조회 hook
 */
export function useTenantRoles(params?: TenantRoleQueryParams) {
  return useQuery({
    queryKey: tenantRolesKeys.list(params),
    queryFn: ({ signal }) => tenantRolesService.listTenantRoles(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useTenantRoleById(id: string) {
  return useQuery({
    queryKey: tenantRolesKeys.detail(id),
    queryFn: ({ signal }) => tenantRolesService.getTenantRole(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateTenantRole(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantRoleRequest) =>
      tenantRolesService.createTenantRole(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tenantRolesKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateTenantRole(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantRoleRequest }) =>
      tenantRolesService.updateTenantRole(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tenantRolesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantRolesKeys.detail(variables.id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteTenantRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantRolesService.deleteTenantRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantRolesKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
