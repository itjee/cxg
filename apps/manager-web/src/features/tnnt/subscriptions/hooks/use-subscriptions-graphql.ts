/**
 * @file use-subscriptions-graphql.ts
 * @description 구독 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 구독 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_SUBSCRIPTIONS,
  GET_SUBSCRIPTION,
  CREATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
} from "../graphql/queries";
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionQueryParams,
} from "../types/subscriptions.types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLSubscriptionToSubscription(
  gqlSubscription: any
): Subscription {
  return {
    id: gqlSubscription.id,
    created_at: gqlSubscription.created_at,
    created_by: gqlSubscription.created_by,
    updated_at: gqlSubscription.updated_at,
    updated_by: gqlSubscription.updated_by,
    tenant_id: gqlSubscription.tenant_id,
    plan_id: gqlSubscription.plan_id,
    start_date: gqlSubscription.start_date,
    close_date: gqlSubscription.close_date,
    billing_cycle: gqlSubscription.billing_cycle,
    max_users: gqlSubscription.max_users,
    max_storage: gqlSubscription.max_storage,
    max_api_calls: gqlSubscription.max_api_calls,
    base_amount: gqlSubscription.base_amount,
    user_amount: gqlSubscription.user_amount,
    currency: gqlSubscription.currency,
    auto_renewal: gqlSubscription.auto_renewal,
    noti_renewal: gqlSubscription.noti_renewal,
    status: gqlSubscription.status,
    is_deleted: gqlSubscription.is_deleted,
  };
}

/**
 * 구독 목록 조회 Hook
 */
export function useSubscriptionsGQL(params?: SubscriptionQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_SUBSCRIPTIONS, {
    variables: {
      limit,
      offset,
      tenant_id: params?.tenant_id,
      plan_id: params?.plan_id,
      status: params?.status,
      billing_cycle: params?.billing_cycle,
      auto_renewal: params?.auto_renewal,
      is_deleted: params?.is_deleted,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.subscriptions) return undefined;

    return {
      data: data.subscriptions.map(mapGraphQLSubscriptionToSubscription),
      total: data.subscriptions.length,
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
 * 구독 상세 조회 Hook
 */
export function useSubscriptionGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_SUBSCRIPTION, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.subscription
      ? mapGraphQLSubscriptionToSubscription(data.subscription)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 구독 생성 Hook (Mutation)
 */
export function useCreateSubscriptionGQL(options?: {
  onSuccess?: (subscription: Subscription) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_SUBSCRIPTION, {
    refetchQueries: [{ query: GET_SUBSCRIPTIONS }],
    onCompleted: (data) => {
      if (data?.createSubscription) {
        const subscription = mapGraphQLSubscriptionToSubscription(
          data.createSubscription
        );
        options?.onSuccess?.(subscription);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "구독 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateSubscriptionRequest) => {
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
 * 구독 수정 Hook (Mutation)
 */
export function useUpdateSubscriptionGQL(options?: {
  onSuccess?: (subscription: Subscription) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_SUBSCRIPTION, {
    refetchQueries: [{ query: GET_SUBSCRIPTIONS }],
    onCompleted: (data) => {
      if (data?.updateSubscription) {
        const subscription = mapGraphQLSubscriptionToSubscription(
          data.updateSubscription
        );
        options?.onSuccess?.(subscription);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "구독 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateSubscriptionRequest }) => {
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
 * 구독 삭제 Hook (Mutation)
 */
export function useDeleteSubscriptionGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_SUBSCRIPTION, {
    refetchQueries: [{ query: GET_SUBSCRIPTIONS }],
    onCompleted: (data) => {
      if (data?.deleteSubscription?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "구독 삭제에 실패했습니다";
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
