/**
 * @file use-tasks.ts
 * @description Tasks TanStack Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../services";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksQueryParams,
} from "../types";

/**
 * Query Key Factory
 */
const tasksKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksKeys.all, "list"] as const,
  list: (params?: TasksQueryParams) => [...tasksKeys.lists(), params] as const,
  detail: (id: string | null | undefined) =>
    [...tasksKeys.all, "detail", id] as const,
};

/**
 * 스케줄된 작업 목록 조회
 */
export function useTasks(params?: TasksQueryParams) {
  return useQuery({
    queryKey: tasksKeys.list(params),
    queryFn: ({ signal }) => tasksService.listTasks(params, signal),
    staleTime: 1 * 60 * 1000, // 1분
    retry: 2,
  });
}

/**
 * 스케줄된 작업 상세 조회
 */
export function useTask(id: string | null | undefined) {
  return useQuery({
    queryKey: tasksKeys.detail(id),
    queryFn: () => tasksService.getTask(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2분
    retry: 2,
  });
}

/**
 * 스케줄된 작업 생성
 */
export function useCreateTask(options?: {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksService.createTask(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      options?.onSuccess?.(newTask);
    },
    onError: options?.onError,
  });
}

/**
 * 스케줄된 작업 수정
 */
export function useUpdateTask(options?: {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      tasksService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tasksKeys.detail(updatedTask.id),
      });
      options?.onSuccess?.(updatedTask);
    },
    onError: options?.onError,
  });
}

/**
 * 스케줄된 작업 삭제
 */
export function useDeleteTask(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * 작업 지금 실행
 */
export function useRunTaskNow(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.runTaskNow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
