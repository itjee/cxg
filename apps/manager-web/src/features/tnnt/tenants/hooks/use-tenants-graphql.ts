/**
 * @file use-tenants-graphql.ts
 * @description 테넌트 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 테넌트 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_TENANTS, GET_TENANT, CREATE_TENANT, UPDATE_TENANT, DELETE_TENANT } from "../graphql/queries";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  TenantQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLTenantToTenant(gqlTenant: any): Tenant {
  return {
    id: gqlTenant.id,
    code: gqlTenant.code,
    name: gqlTenant.name,
    domain: gqlTenant.domain,
    email: gqlTenant.email,
    phone: gqlTenant.phone,
    address: gqlTenant.address,
    city: gqlTenant.city,
    state: gqlTenant.state,
    country: gqlTenant.country,
    postal_code: gqlTenant.postal_code,
    industry: gqlTenant.industry,
    size: gqlTenant.size,
    status: gqlTenant.status,
    is_suspended: gqlTenant.is_suspended,
    trial_ends_at: gqlTenant.trial_ends_at,
    created_at: gqlTenant.created_at,
    updated_at: gqlTenant.updated_at,
    created_by: gqlTenant.created_by,
    updated_by: gqlTenant.updated_by,
  };
}

/**
 * 테넌트 목록 조회 Hook
 */
export function useTenantsGQL(params?: TenantQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = ((params?.page || 0) * limit);

  const { data, loading, error, refetch } = useQuery(GET_TENANTS, {
    variables: {
      limit,
      offset,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.tenants) return undefined;

    return {
      data: data.tenants.map(mapGraphQLTenantToTenant),
      total: data.tenants.length,
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
 * 테넌트 상세 조회 Hook
 */
export function useTenantGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_TENANT, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.tenant ? mapGraphQLTenantToTenant(data.tenant) : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 테넌트 생성 Hook (Mutation)
 */
export function useCreateTenantGQL(options?: {
  onSuccess?: (tenant: Tenant) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_TENANT, {
    refetchQueries: [{ query: GET_TENANTS }],
    onCompleted: (data) => {
      if (data?.createTenant) {
        const tenant = mapGraphQLTenantToTenant(data.createTenant);
        options?.onSuccess?.(tenant);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateTenantRequest) => {
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
 * 테넌트 수정 Hook (Mutation)
 */
export function useUpdateTenantGQL(options?: {
  onSuccess?: (tenant: Tenant) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_TENANT, {
    refetchQueries: [{ query: GET_TENANTS }],
    onCompleted: (data) => {
      if (data?.updateTenant) {
        const tenant = mapGraphQLTenantToTenant(data.updateTenant);
        options?.onSuccess?.(tenant);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateTenantRequest }) => {
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
 * 테넌트 삭제 Hook (Mutation)
 */
export function useDeleteTenantGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_TENANT, {
    refetchQueries: [{ query: GET_TENANTS }],
    onCompleted: (data) => {
      if (data?.deleteTenant?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 삭제에 실패했습니다";
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
