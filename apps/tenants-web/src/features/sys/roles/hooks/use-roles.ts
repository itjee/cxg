/**
 * useRoles Hook
 * TanStack Query를 사용한 역할 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, getRole, createRole, updateRole, deleteRole } from "../services";
import type { Role, CreateRoleRequest, UpdateRoleRequest, RoleQueryParams } from "../types";

// 쿼리 키 팩토리 패턴
const rolesKeys = {
  all: ["roles"] as const,
  lists: () => [...rolesKeys.all, "list"] as const,
  list: (params?: RoleQueryParams) => [...rolesKeys.lists(), params] as const,
  details: () => [...rolesKeys.all, "detail"] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
};

/**
 * 역할 목록 조회 훅
 */
export function useRoles(params?: RoleQueryParams) {
  return useQuery({
    queryKey: rolesKeys.list(params),
    queryFn: () => getRoles(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 역할 상세 조회 훅
 */
export function useRole(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? rolesKeys.detail(id) : [],
    queryFn: () => getRole(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 역할 생성 훅
 */
export function useCreateRole(options?: {
  onSuccess?: (role: Role) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRole(data),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      options?.onSuccess?.(newRole.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 역할 수정 훅
 */
export function useUpdateRole(options?: {
  onSuccess?: (role: Role) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      updateRole(id, data),
    onSuccess: (updatedRole, variables) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(variables.id) });
      options?.onSuccess?.(updatedRole.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 역할 삭제 훅
 */
export function useDeleteRole(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}
