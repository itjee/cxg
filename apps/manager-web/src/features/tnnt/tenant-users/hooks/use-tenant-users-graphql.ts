/**
 * @file use-tenant-users-graphql.ts
 * @description 테넌트 사용자 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 테넌트 사용자 CRUD 작업 hooks
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  GET_TENANT_USERS,
  GET_TENANT_USER,
  CREATE_TENANT_USER,
  UPDATE_TENANT_USER,
  DELETE_TENANT_USER,
  CHANGE_TENANT_USER_PASSWORD,
  RESET_TENANT_USER_PASSWORD,
} from "../graphql/queries";
import type {
  TenantUser,
  CreateTenantUserRequest,
  UpdateTenantUserRequest,
  ChangePasswordRequest,
  TenantUserQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 snake_case를 그대로 유지
 */
function mapGraphQLTenantUserToTenantUser(gqlTenantUser: any): TenantUser {
  return {
    id: gqlTenantUser.id,
    created_at: gqlTenantUser.created_at,
    created_by: gqlTenantUser.created_by,
    updated_at: gqlTenantUser.updated_at,
    updated_by: gqlTenantUser.updated_by,
    tenant_id: gqlTenantUser.tenant_id,
    user_id: gqlTenantUser.user_id,
    username: gqlTenantUser.username,
    email: gqlTenantUser.email,
    full_name: gqlTenantUser.full_name,
    phone_number: gqlTenantUser.phone_number,
    role_id: gqlTenantUser.role_id,
    role_name: gqlTenantUser.role_name,
    permissions: gqlTenantUser.permissions || [],
    last_login_at: gqlTenantUser.last_login_at,
    login_count: gqlTenantUser.login_count,
    failed_login_count: gqlTenantUser.failed_login_count,
    status: gqlTenantUser.status,
    is_primary: gqlTenantUser.is_primary,
    is_deleted: gqlTenantUser.is_deleted,
  };
}

/**
 * 테넌트 사용자 목록 조회 Hook
 */
export function useTenantUsersGQL(params?: TenantUserQueryParams) {
  const limit = params?.pageSize || 20;
  const offset = (params?.page || 0) * limit;

  const { data, loading, error, refetch } = useQuery(GET_TENANT_USERS, {
    variables: {
      limit,
      offset,
      tenant_id: params?.tenant_id,
      role_id: params?.role_id,
      status: params?.status,
      is_primary: params?.is_primary,
      search: params?.search,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const mappedData = useMemo(() => {
    if (!data?.tenantUsers) return undefined;

    return {
      items: data.tenantUsers.map(mapGraphQLTenantUserToTenantUser),
      total: data.tenantUsers.length,
      page: params?.page || 0,
      page_size: limit,
      total_pages: Math.ceil((data.tenantUsers.length || 0) / limit),
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
 * 테넌트 사용자 상세 조회 Hook
 */
export function useTenantUserGQL(id: string | null | undefined) {
  const { data, loading, error } = useQuery(GET_TENANT_USER, {
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "cache-first",
  });

  const mappedData = useMemo(() => {
    return data?.tenantUser
      ? mapGraphQLTenantUserToTenantUser(data.tenantUser)
      : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 테넌트 사용자 생성 Hook (Mutation)
 */
export function useCreateTenantUserGQL(options?: {
  onSuccess?: (tenantUser: TenantUser) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_TENANT_USER, {
    refetchQueries: [{ query: GET_TENANT_USERS }],
    onCompleted: (data) => {
      if (data?.createTenantUser) {
        const tenantUser = mapGraphQLTenantUserToTenantUser(
          data.createTenantUser
        );
        options?.onSuccess?.(tenantUser);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg =
        error.message || "테넌트 사용자 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateTenantUserRequest) => {
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
 * 테넌트 사용자 수정 Hook (Mutation)
 */
export function useUpdateTenantUserGQL(options?: {
  onSuccess?: (tenantUser: TenantUser) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_TENANT_USER, {
    refetchQueries: [{ query: GET_TENANT_USERS }],
    onCompleted: (data) => {
      if (data?.updateTenantUser) {
        const tenantUser = mapGraphQLTenantUserToTenantUser(
          data.updateTenantUser
        );
        options?.onSuccess?.(tenantUser);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg =
        error.message || "테넌트 사용자 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateTenantUserRequest }) => {
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
 * 테넌트 사용자 삭제 Hook (Mutation)
 */
export function useDeleteTenantUserGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(DELETE_TENANT_USER, {
    refetchQueries: [{ query: GET_TENANT_USERS }],
    onCompleted: (data) => {
      if (data?.deleteTenantUser?.success) {
        options?.onSuccess?.();
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg =
        error.message || "테넌트 사용자 삭제에 실패했습니다";
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
 * 테넌트 사용자 비밀번호 변경 Hook (Mutation)
 */
export function useChangeTenantUserPasswordGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(
    CHANGE_TENANT_USER_PASSWORD,
    {
      onCompleted: (data) => {
        if (data?.changeTenantUserPassword?.success) {
          options?.onSuccess?.();
        }
      },
      onError: (error: ApolloError) => {
        const errorMsg =
          error.message || "비밀번호 변경에 실패했습니다";
        options?.onError?.(new Error(errorMsg));
      },
    }
  );

  return {
    mutate: ({ id, data }: { id: string; data: ChangePasswordRequest }) => {
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
 * 테넌트 사용자 비밀번호 재설정 Hook (Mutation)
 */
export function useResetTenantUserPasswordGQL(options?: {
  onSuccess?: (temporaryPassword: string) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(
    RESET_TENANT_USER_PASSWORD,
    {
      onCompleted: (data) => {
        if (data?.resetTenantUserPassword?.success) {
          options?.onSuccess?.(data.resetTenantUserPassword.temporary_password);
        }
      },
      onError: (error: ApolloError) => {
        const errorMsg =
          error.message || "비밀번호 재설정에 실패했습니다";
        options?.onError?.(new Error(errorMsg));
      },
    }
  );

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
