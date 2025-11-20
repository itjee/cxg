/**
 * @file use-workflows-graphql.ts
 * @description 워크플로우 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 워크플로우 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_WORKFLOWS,
  GET_WORKFLOW,
  CREATE_WORKFLOW,
  UPDATE_WORKFLOW,
  DELETE_WORKFLOW,
} from "../graphql/queries";
import type {
  Workflows,
  CreateWorkflowsRequest,
  UpdateWorkflowsRequest,
  WorkflowsQueryParams,
} from "../types/workflows.types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLWorkflowToWorkflow(gqlWorkflow: any): Workflows {
  return {
    id: gqlWorkflow.id,
    created_at: gqlWorkflow.created_at,
    updated_at: gqlWorkflow.updated_at,
    created_by: gqlWorkflow.created_by,
    updated_by: gqlWorkflow.updated_by,
    name: gqlWorkflow.name,
    description: gqlWorkflow.description,
    is_active: gqlWorkflow.is_active,
    is_deleted: gqlWorkflow.is_deleted,
  };
}

/**
 * 워크플로우 목록 조회 Hook
 */
export function useWorkflowsGQL(params?: WorkflowsQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_WORKFLOWS, {
    variables: {
      limit,
      offset,
      active: params?.active,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.workflows) return undefined;

    return {
      items: data.workflows.map(mapGraphQLWorkflowToWorkflow),
      total: data.workflows.length,
      page: params?.page || 0,
      page_size: limit,
      total_pages: Math.ceil((data.workflows.length || 0) / limit),
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
 * 워크플로우 상세 조회 Hook
 */
export function useWorkflowGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_WORKFLOW, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.workflow
      ? mapGraphQLWorkflowToWorkflow(data.workflow)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 워크플로우 생성 Hook (Mutation)
 */
export function useCreateWorkflowGQL(options?: {
  onSuccess?: (workflow: Workflows) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_WORKFLOW, {
    refetchQueries: [{ query: GET_WORKFLOWS }],
    onCompleted: (data) => {
      if (data?.createWorkflow) {
        const workflow = mapGraphQLWorkflowToWorkflow(data.createWorkflow);
        options?.onSuccess?.(workflow);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "워크플로우 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateWorkflowsRequest) => {
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
 * 워크플로우 수정 Hook (Mutation)
 */
export function useUpdateWorkflowGQL(options?: {
  onSuccess?: (workflow: Workflows) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_WORKFLOW, {
    refetchQueries: [{ query: GET_WORKFLOWS }],
    onCompleted: (data) => {
      if (data?.updateWorkflow) {
        const workflow = mapGraphQLWorkflowToWorkflow(data.updateWorkflow);
        options?.onSuccess?.(workflow);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "워크플로우 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateWorkflowsRequest }) => {
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
 * 워크플로우 삭제 Hook (Mutation)
 */
export function useDeleteWorkflowGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_WORKFLOW, {
    refetchQueries: [{ query: GET_WORKFLOWS }],
    onCompleted: (data) => {
      if (data?.deleteWorkflow?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "워크플로우 삭제에 실패했습니다";
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
