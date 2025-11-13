/**
 * @file use-permissions.ts
 * @description Permissions React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsService } from '../services/permissions.service';
import type { 
  PermissionsQueryParams,
  CreatePermissionsRequest,
  UpdatePermissionsRequest
} from '../types/permissions.types';

/**
 * 목록 조회 hook
 */
export function usePermissions(params?: PermissionsQueryParams) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: ({ signal }) => permissionsService.listPermissions(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function usePermissionsById(id: string) {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: ({ signal }) => permissionsService.getPermissions(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreatePermissions(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionsRequest) => 
      permissionsService.createPermissions(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdatePermissions(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionsRequest }) =>
      permissionsService.updatePermissions(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeletePermissions(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionsService.deletePermissions(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
