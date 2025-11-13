/**
 * @file use-tenant-users.ts
 * @description 테넌트 사용자 관리 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantUsersService } from '../services';
import type {
  TenantUserQueryParams,
  CreateTenantUserRequest,
  UpdateTenantUserRequest,
  ChangePasswordRequest,
} from '../types';

/**
 * Query Key Factory
 */
export const tenantUsersKeys = {
  all: ['tenant-users'] as const,
  lists: () => [...tenantUsersKeys.all, 'list'] as const,
  list: (params?: TenantUserQueryParams) =>
    [...tenantUsersKeys.lists(), params] as const,
  detail: (id: string) => [...tenantUsersKeys.all, 'detail', id] as const,
};

/**
 * 목록 조회 hook
 */
export function useTenantUsers(params?: TenantUserQueryParams) {
  return useQuery({
    queryKey: tenantUsersKeys.list(params),
    queryFn: ({ signal }) => tenantUsersService.listTenantUsers(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useTenantUserById(id: string) {
  return useQuery({
    queryKey: tenantUsersKeys.detail(id),
    queryFn: ({ signal }) => tenantUsersService.getTenantUser(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateTenantUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantUserRequest) =>
      tenantUsersService.createTenantUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tenantUsersKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateTenantUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantUserRequest }) =>
      tenantUsersService.updateTenantUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tenantUsersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantUsersKeys.detail(variables.id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteTenantUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantUsersService.deleteTenantUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantUsersKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * 비밀번호 변경 mutation hook
 */
export function useChangePassword(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordRequest }) =>
      tenantUsersService.changePassword(id, data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * 비밀번호 재설정 mutation hook
 */
export function useResetPassword(options?: {
  onSuccess?: (data: { temporary_password: string }) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (id: string) => tenantUsersService.resetPassword(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
