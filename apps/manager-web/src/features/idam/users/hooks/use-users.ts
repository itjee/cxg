/**
 * @file use-users.ts
 * @description Users React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import type { 
  UsersQueryParams,
  CreateUsersRequest,
  UpdateUsersRequest
} from '../types/users.types';

/**
 * Query Key Factory
 */
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params?: UsersQueryParams) => [...usersKeys.lists(), params] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
};

/**
 * 목록 조회 hook
 */
export function useUsers(params?: UsersQueryParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: ({ signal }) => usersService.listUsers(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useUsersById(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: ({ signal }) => usersService.getUsers(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateUsers(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsersRequest) => 
      usersService.createUsers(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateUsers(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsersRequest }) =>
      usersService.updateUsers(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteUsers(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUsers(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
