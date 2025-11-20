/**
 * @file use-tasks-graphql.ts
 * @description 작업 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 작업 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_TASKS,
  GET_TASK,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  RUN_TASK_NOW,
} from "../graphql/queries";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLTaskToTask(gqlTask: any): Task {
  return {
    id: gqlTask.id,
    created_at: gqlTask.created_at,
    updated_at: gqlTask.updated_at,
    created_by: gqlTask.created_by,
    updated_by: gqlTask.updated_by,
    task_name: gqlTask.task_name,
    task_type: gqlTask.task_type,
    description: gqlTask.description,
    schedule_expression: gqlTask.schedule_expression,
    timezone: gqlTask.timezone,
    command: gqlTask.command,
    parameters: gqlTask.parameters,
    working_directory: gqlTask.working_directory,
    environment_variables: gqlTask.environment_variables,
    max_execution_time: gqlTask.max_execution_time,
    max_instances: gqlTask.max_instances,
    notify_success: gqlTask.notify_success,
    notify_failure: gqlTask.notify_failure,
    notify_emails: gqlTask.notify_emails,
    next_run_at: gqlTask.next_run_at,
    last_run_at: gqlTask.last_run_at,
    last_run_status: gqlTask.last_run_status,
    last_run_duration: gqlTask.last_run_duration,
    total_runs: gqlTask.total_runs,
    successful_runs: gqlTask.successful_runs,
    failed_runs: gqlTask.failed_runs,
    enabled: gqlTask.enabled,
    deleted: gqlTask.deleted,
  };
}

/**
 * 작업 목록 조회 Hook
 */
export function useTasksGQL(params?: TasksQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      limit,
      offset,
      task_type: params?.task_type,
      enabled: params?.enabled,
      last_run_status: params?.last_run_status,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.tasks) return undefined;

    return {
      items: data.tasks.map(mapGraphQLTaskToTask),
      total: data.tasks.length,
      page: params?.page || 0,
      page_size: limit,
      total_pages: Math.ceil((data.tasks.length || 0) / limit),
    };
  }, [data, limit, params?.page]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
    refetch,
  };
}

/**
 * 작업 상세 조회 Hook
 */
export function useTaskGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_TASK, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.task ? mapGraphQLTaskToTask(data.task) : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 작업 생성 Hook (Mutation)
 */
export function useCreateTaskGQL(options?: {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: (data) => {
      if (data?.createTask) {
        const task = mapGraphQLTaskToTask(data.createTask);
        options?.onSuccess?.(task);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "작업 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateTaskRequest) => {
      return mutate({
        variables: {
          input: data,
        },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 작업 수정 Hook (Mutation)
 */
export function useUpdateTaskGQL(options?: {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: (data) => {
      if (data?.updateTask) {
        const task = mapGraphQLTaskToTask(data.updateTask);
        options?.onSuccess?.(task);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "작업 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateTaskRequest }) => {
      return mutate({
        variables: {
          id,
          input: data,
        },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 작업 삭제 Hook (Mutation)
 */
export function useDeleteTaskGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: (data) => {
      if (data?.deleteTask?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "작업 삭제에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (id: string) => {
      return mutate({
        variables: { id },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 작업 즉시 실행 Hook (Mutation)
 */
export function useRunTaskNowGQL(options?: {
  onSuccess?: (executionId: string) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(RUN_TASK_NOW, {
    onCompleted: (data) => {
      if (data?.runTaskNow?.success) {
        options?.onSuccess?.(data.runTaskNow.execution_id);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "작업 실행에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (id: string) => {
      return mutate({
        variables: { id },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}
