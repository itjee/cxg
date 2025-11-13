/**
 * @file use-login-logs.ts
 * @description 로그인 이력 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loginLogService } from '../services';
import type {
  LoginLog,
  CreateLoginLogRequest,
  LoginLogQueryParams,
} from '../types';

/**
 * Query Key Factory
 */
export const loginLogsKeys = {
  all: ['loginLogs'] as const,
  lists: () => [...loginLogsKeys.all, 'list'] as const,
  list: (params?: LoginLogQueryParams) => [...loginLogsKeys.lists(), params] as const,
  detail: (id: string) => [...loginLogsKeys.all, 'detail', id] as const,
  stats: (params?: { start_date?: string; end_date?: string }) => 
    [...loginLogsKeys.all, 'stats', params] as const,
};

/**
 * 목록 조회 훅
 */
export function useLoginLogs(params?: LoginLogQueryParams) {
  return useQuery({
    queryKey: loginLogsKeys.list(params),
    queryFn: () => loginLogService.listLoginLogs(params),
    staleTime: 2 * 60 * 1000, // 2분 (로그는 자주 갱신)
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 상세 조회 훅
 */
export function useLoginLog(id: string | null | undefined) {
  return useQuery({
    queryKey: loginLogsKeys.detail(id!),
    queryFn: () => loginLogService.getLoginLog(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 생성 훅
 */
export function useCreateLoginLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoginLogRequest) => loginLogService.createLoginLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loginLogsKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create login log:', error);
    },
  });
}

/**
 * 삭제 훅
 */
export function useDeleteLoginLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loginLogService.deleteLoginLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loginLogsKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete login log:', error);
    },
  });
}

/**
 * 통계 조회 훅
 */
export function useLoginLogStats(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: loginLogsKeys.stats(params),
    queryFn: () => loginLogService.getLoginLogStats(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
