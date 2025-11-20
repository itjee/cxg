/**
 * @file use-tenant-roles-graphql.ts
 * @description 테넌트 역할 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 테넌트 역할 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_TENANT_ROLES,
  GET_TENANT_ROLE,
  CREATE_TENANT_ROLE,
  UPDATE_TENANT_ROLE,
  DELETE_TENANT_ROLE,
} from "../graphql/queries";
import type {
  TenantRole,
  CreateTenantRoleRequest,
  UpdateTenantRoleRequest,
  TenantRoleQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLTenantRoleToTenantRole(gqlTenantRole: any): TenantRole {
  return {
    id: gqlTenantRole.id,
    created_at: gqlTenantRole.created_at,
    created_by: gqlTenantRole.created_by,
    updated_at: gqlTenantRole.updated_at,
    updated_by: gqlTenantRole.updated_by,
    tenant_id: gqlTenantRole.tenant_id,
    role_name: gqlTenantRole.role_name,
    role_code: gqlTenantRole.role_code,
    description: gqlTenantRole.description,
    permissions: gqlTenantRole.permissions || [],
    status: gqlTenantRole.status,
    is_system_role: gqlTenantRole.is_system_role,
    is_deleted: gqlTenantRole.is_deleted,
  };
}

/**
 * 테넌트 역할 목록 조회 Hook
 */
export function useTenantRolesGQL(params?: TenantRoleQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_TENANT_ROLES, {
    variables: {
      limit,
      offset,
      tenant_id: params?.tenant_id,
      status: params?.status,
      is_system_role: params?.is_system_role,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.tenantRoles) return undefined;

    return {
      items: data.tenantRoles.map(mapGraphQLTenantRoleToTenantRole),
      total: data.tenantRoles.length,
      page: params?.page || 0,
      page_size: limit,
      total_pages: Math.ceil((data.tenantRoles.length || 0) / limit),
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
 * 테넌트 역할 상세 조회 Hook
 */
export function useTenantRoleGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_TENANT_ROLE, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.tenantRole
      ? mapGraphQLTenantRoleToTenantRole(data.tenantRole)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 테넌트 역할 생성 Hook (Mutation)
 */
export function useCreateTenantRoleGQL(options?: {
  onSuccess?: (tenantRole: TenantRole) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_TENANT_ROLE, {
    refetchQueries: [{ query: GET_TENANT_ROLES }],
    onCompleted: (data) => {
      if (data?.createTenantRole) {
        const tenantRole = mapGraphQLTenantRoleToTenantRole(
          data.createTenantRole
        );
        options?.onSuccess?.(tenantRole);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 역할 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateTenantRoleRequest) => {
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
 * 테넌트 역할 수정 Hook (Mutation)
 */
export function useUpdateTenantRoleGQL(options?: {
  onSuccess?: (tenantRole: TenantRole) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_TENANT_ROLE, {
    refetchQueries: [{ query: GET_TENANT_ROLES }],
    onCompleted: (data) => {
      if (data?.updateTenantRole) {
        const tenantRole = mapGraphQLTenantRoleToTenantRole(
          data.updateTenantRole
        );
        options?.onSuccess?.(tenantRole);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 역할 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateTenantRoleRequest }) => {
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
 * 테넌트 역할 삭제 Hook (Mutation)
 */
export function useDeleteTenantRoleGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_TENANT_ROLE, {
    refetchQueries: [{ query: GET_TENANT_ROLES }],
    onCompleted: (data) => {
      if (data?.deleteTenantRole?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "테넌트 역할 삭제에 실패했습니다";
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
