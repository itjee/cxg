/**
 * @file use-sessions.ts
 * @description 세션 관리 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "../services";
import type {
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionQueryParams,
} from "../types";

/**
 * Query Key Factory
 */
export const sessionsKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionsKeys.all, "list"] as const,
  list: (params?: SessionQueryParams) => [...sessionsKeys.lists(), params] as const,
  detail: (id: string) => [...sessionsKeys.all, "detail", id] as const,
};

/**
 * 목록 조회 훅
 */
export function useSessions(params?: SessionQueryParams) {
  return useQuery({
    queryKey: sessionsKeys.list(params),
    queryFn: () => sessionService.listSessions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 훅
 */
export function useSession(id: string | null | undefined) {
  return useQuery({
    queryKey: sessionsKeys.detail(id!),
    queryFn: () => sessionService.getSession(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 생성 훅
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
    },
  });
}

/**
 * 수정 훅
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSessionRequest }) =>
      sessionService.updateSession(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error("Failed to update session:", error);
    },
  });
}

/**
 * 삭제 훅
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete session:", error);
    },
  });
}

/**
 * 세션 취소 훅
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sessionService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to revoke session:", error);
    },
  });
}

/**
 * 사용자 모든 세션 취소 훅
 */
export function useRevokeUserSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => sessionService.revokeUserSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to revoke user sessions:", error);
    },
  });
}
