/**
 * @file use-onboardings-graphql.ts
 * @description 온보딩 프로세스 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 온보딩 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_ONBOARDINGS,
  GET_ONBOARDING,
  CREATE_ONBOARDING,
  UPDATE_ONBOARDING,
  DELETE_ONBOARDING,
  RETRY_ONBOARDING_STEP,
} from "../graphql/queries";
import type {
  Onboarding,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  OnboardingQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLOnboardingToOnboarding(gqlOnboarding: any): Onboarding {
  return {
    id: gqlOnboarding.id,
    created_at: gqlOnboarding.created_at,
    created_by: gqlOnboarding.created_by,
    updated_at: gqlOnboarding.updated_at,
    updated_by: gqlOnboarding.updated_by,
    tenant_id: gqlOnboarding.tenant_id,
    step_name: gqlOnboarding.step_name,
    step_order: gqlOnboarding.step_order,
    step_status: gqlOnboarding.step_status,
    started_at: gqlOnboarding.started_at,
    completed_at: gqlOnboarding.completed_at,
    error_message: gqlOnboarding.error_message,
    retry_count: gqlOnboarding.retry_count,
    step_data: gqlOnboarding.step_data,
    status: gqlOnboarding.status,
    is_deleted: gqlOnboarding.is_deleted,
  };
}

/**
 * 온보딩 목록 조회 Hook
 */
export function useOnboardingsGQL(params?: OnboardingQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_ONBOARDINGS, {
    variables: {
      limit,
      offset,
      tenant_id: params?.tenant_id,
      step_name: params?.step_name,
      step_status: params?.step_status,
      status: params?.status,
      is_deleted: params?.is_deleted,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.onboardings) return undefined;

    return {
      data: data.onboardings.map(mapGraphQLOnboardingToOnboarding),
      total: data.onboardings.length,
      page: params?.page || 0,
      pageSize: limit,
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
 * 온보딩 상세 조회 Hook
 */
export function useOnboardingGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_ONBOARDING, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.onboarding
      ? mapGraphQLOnboardingToOnboarding(data.onboarding)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 온보딩 생성 Hook (Mutation)
 */
export function useCreateOnboardingGQL(options?: {
  onSuccess?: (onboarding: Onboarding) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_ONBOARDING, {
    refetchQueries: [{ query: GET_ONBOARDINGS }],
    onCompleted: (data) => {
      if (data?.createOnboarding) {
        const onboarding = mapGraphQLOnboardingToOnboarding(
          data.createOnboarding
        );
        options?.onSuccess?.(onboarding);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "온보딩 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateOnboardingRequest) => {
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
 * 온보딩 수정 Hook (Mutation)
 */
export function useUpdateOnboardingGQL(options?: {
  onSuccess?: (onboarding: Onboarding) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_ONBOARDING, {
    refetchQueries: [{ query: GET_ONBOARDINGS }],
    onCompleted: (data) => {
      if (data?.updateOnboarding) {
        const onboarding = mapGraphQLOnboardingToOnboarding(
          data.updateOnboarding
        );
        options?.onSuccess?.(onboarding);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "온보딩 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateOnboardingRequest }) => {
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
 * 온보딩 삭제 Hook (Mutation)
 */
export function useDeleteOnboardingGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_ONBOARDING, {
    refetchQueries: [{ query: GET_ONBOARDINGS }],
    onCompleted: (data) => {
      if (data?.deleteOnboarding?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "온보딩 삭제에 실패했습니다";
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
 * 온보딩 단계 재시도 Hook (Mutation)
 */
export function useRetryOnboardingStepGQL(options?: {
  onSuccess?: (onboarding: Onboarding) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(RETRY_ONBOARDING_STEP, {
    onCompleted: (data) => {
      if (data?.retryOnboardingStep) {
        const onboarding = mapGraphQLOnboardingToOnboarding(
          data.retryOnboardingStep
        );
        options?.onSuccess?.(onboarding);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "온보딩 단계 재시도에 실패했습니다";
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
