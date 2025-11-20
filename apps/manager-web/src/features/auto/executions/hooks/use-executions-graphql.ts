/**
 * @file use-executions-graphql.ts
 * @description 워크플로우 실행 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 실행 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_EXECUTIONS,
  GET_EXECUTION,
  CREATE_EXECUTION,
  UPDATE_EXECUTION,
  DELETE_EXECUTION,
  RETRY_EXECUTION,
} from "../graphql/queries";
import type {
  Execution,
  CreateExecutionRequest,
  UpdateExecutionRequest,
  ExecutionsQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLExecutionToExecution(gqlExecution: any): Execution {
  return {
    id: gqlExecution.id,
    created_at: gqlExecution.created_at,
    updated_at: gqlExecution.updated_at,
    created_by: gqlExecution.created_by,
    updated_by: gqlExecution.updated_by,
    workflow_id: gqlExecution.workflow_id,
    tenant_id: gqlExecution.tenant_id,
    execution_id: gqlExecution.execution_id,
    trigger_source: gqlExecution.trigger_source,
    triggered_by: gqlExecution.triggered_by,
    input_data: gqlExecution.input_data,
    output_data: gqlExecution.output_data,
    status: gqlExecution.status,
    current_step: gqlExecution.current_step,
    completed_steps: gqlExecution.completed_steps,
    failed_step: gqlExecution.failed_step,
    started_at: gqlExecution.started_at,
    completed_at: gqlExecution.completed_at,
    duration: gqlExecution.duration,
    error_message: gqlExecution.error_message,
    error_details: gqlExecution.error_details,
    retry_count: gqlExecution.retry_count,
    cpu_usage: gqlExecution.cpu_usage,
    memory_usage: gqlExecution.memory_usage,
    deleted: gqlExecution.deleted,
  };
}

/**
 * 실행 목록 조회 Hook
 */
export function useExecutionsGQL(params?: ExecutionsQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_EXECUTIONS, {
    variables: {
      limit,
      offset,
      workflow_id: params?.workflow_id,
      status: params?.status,
      trigger_source: params?.trigger_source,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.executions) return undefined;

    return {
      items: data.executions.map(mapGraphQLExecutionToExecution),
      total: data.executions.length,
      page: params?.page || 0,
      page_size: limit,
      total_pages: Math.ceil((data.executions.length || 0) / limit),
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
 * 실행 상세 조회 Hook
 */
export function useExecutionGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_EXECUTION, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.execution
      ? mapGraphQLExecutionToExecution(data.execution)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 실행 생성 Hook (Mutation)
 */
export function useCreateExecutionGQL(options?: {
  onSuccess?: (execution: Execution) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_EXECUTION, {
    refetchQueries: [{ query: GET_EXECUTIONS }],
    onCompleted: (data) => {
      if (data?.createExecution) {
        const execution = mapGraphQLExecutionToExecution(data.createExecution);
        options?.onSuccess?.(execution);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "실행 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateExecutionRequest) => {
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
 * 실행 수정 Hook (Mutation)
 */
export function useUpdateExecutionGQL(options?: {
  onSuccess?: (execution: Execution) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_EXECUTION, {
    refetchQueries: [{ query: GET_EXECUTIONS }],
    onCompleted: (data) => {
      if (data?.updateExecution) {
        const execution = mapGraphQLExecutionToExecution(data.updateExecution);
        options?.onSuccess?.(execution);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "실행 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateExecutionRequest }) => {
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
 * 실행 삭제 Hook (Mutation)
 */
export function useDeleteExecutionGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_EXECUTION, {
    refetchQueries: [{ query: GET_EXECUTIONS }],
    onCompleted: (data) => {
      if (data?.deleteExecution?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "실행 삭제에 실패했습니다";
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
 * 실행 재시도 Hook (Mutation)
 */
export function useRetryExecutionGQL(options?: {
  onSuccess?: (execution: Execution) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(RETRY_EXECUTION, {
    onCompleted: (data) => {
      if (data?.retryExecution) {
        const execution = mapGraphQLExecutionToExecution(data.retryExecution);
        options?.onSuccess?.(execution);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "실행 재시도에 실패했습니다";
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
