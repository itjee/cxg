/**
 * usePermissions Hook
 * TanStack Query를 사용한 권한 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPermissions, getPermission, createPermission, updatePermission, deletePermission } from "../services";
import type { Permission, CreatePermissionRequest, UpdatePermissionRequest, PermissionQueryParams } from "../types";

// 쿼리 키 팩토리 패턴
const permissionsKeys = {
  all: ["permissions"] as const,
  lists: () => [...permissionsKeys.all, "list"] as const,
  list: (params?: PermissionQueryParams) => [...permissionsKeys.lists(), params] as const,
  details: () => [...permissionsKeys.all, "detail"] as const,
  detail: (id: string) => [...permissionsKeys.details(), id] as const,
};

/**
 * 권한 목록 조회 훅
 */
export function usePermissions(params?: PermissionQueryParams) {
  return useQuery({
    queryKey: permissionsKeys.list(params),
    queryFn: () => getPermissions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 권한 상세 조회 훅
 */
export function usePermission(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? permissionsKeys.detail(id) : [],
    queryFn: () => getPermission(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 권한 생성 훅
 */
export function useCreatePermission(options?: {
  onSuccess?: (permission: Permission) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => createPermission(data),
    onSuccess: (newPermission) => {
      queryClient.invalidateQueries({ queryKey: permissionsKeys.lists() });
      options?.onSuccess?.(newPermission.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 권한 수정 훅
 */
export function useUpdatePermission(options?: {
  onSuccess?: (permission: Permission) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionRequest }) =>
      updatePermission(id, data),
    onSuccess: (updatedPermission, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: permissionsKeys.detail(variables.id) });
      options?.onSuccess?.(updatedPermission.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 권한 삭제 훅
 */
export function useDeletePermission(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionsKeys.lists() });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}
