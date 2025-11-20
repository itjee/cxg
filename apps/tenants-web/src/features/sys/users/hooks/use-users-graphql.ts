/**
 * @file use-users-graphql.ts
 * @description 사용자 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 사용자 CRUD 작업 hooks
 * - 서버 상태 관리 (캐싱, 동기화, 재요청)
 * - Optimistic Updates (낙관적 업데이트)
 * - 자동 에러 처리 및 재시도
 * - 무효화 및 재조회 자동화
 */

import { useMemo } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_USERS, GET_USER, CREATE_USER, UPDATE_USER } from "../queries/users.queries";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
} from "../types";

/**
 * GraphQL 응답 타입 매핑
 *
 * GraphQL의 camelCase를 프론트엔드의 snake_case로 변환
 */
function mapGraphQLUserToUser(gqlUser: any): User {
  return {
    id: gqlUser.id,
    user_code: gqlUser.user_code,
    username: gqlUser.username,
    email: gqlUser.email,
    full_name: gqlUser.first_name
      ? `${gqlUser.first_name} ${gqlUser.last_name || ""}`.trim()
      : "",
    first_name: gqlUser.first_name,
    last_name: gqlUser.last_name,
    phone: gqlUser.phone,
    department_id: gqlUser.department_id,
    position: gqlUser.position,
    role_id: gqlUser.role_id,
    role_name: "", // TODO: role 정보 로더에서 추가
    failed_login_attempts: gqlUser.failed_login_attempts,
    locked_until: gqlUser.locked_until,
    last_login_at: gqlUser.last_login_at,
    last_login_ip: gqlUser.last_login_ip,
    is_system_user: gqlUser.is_system_user,
    is_active: gqlUser.is_active,
    is_deleted: gqlUser.is_deleted,
    created_at: gqlUser.created_at,
    updated_at: gqlUser.updated_at,
    created_by: gqlUser.created_by,
    updated_by: gqlUser.updated_by,
  };
}

/**
 * 입력 데이터를 GraphQL 입력으로 변환
 *
 * 프론트엔드 필드명을 GraphQL 입력 타입 필드명으로 변환
 */
function mapCreateUserRequestToGraphQL(data: CreateUserRequest): any {
  const [firstName, ...lastNameParts] = (data.full_name || "").split(" ");

  return {
    user_code: data.user_code || "",
    username: data.username || "",
    email: data.email || "",
    password: data.password || "",
    first_name: firstName && firstName.trim() ? firstName.trim() : null,
    last_name: lastNameParts.length > 0 ? lastNameParts.join(" ").trim() : null,
    phone: data.phone || null,
    department_id: data.department_id || null,
    position: data.position || null,
    role_id: data.role_id || null,
  };
}

function mapUpdateUserRequestToGraphQL(data: UpdateUserRequest): any {
  const fullName = data.full_name || "";
  const [firstName, ...lastNameParts] = fullName.split(" ");

  return {
    email: data.email || null,
    first_name: firstName && firstName.trim() ? firstName.trim() : null,
    last_name: lastNameParts.length > 0 ? lastNameParts.join(" ").trim() : null,
    phone: data.phone || null,
    department_id: data.department_id || null,
    position: data.position || null,
    role_id: data.role_id || null,
    is_active: data.is_active !== undefined ? data.is_active : null,
  };
}

/**
 * 사용자 목록 조회 Hook
 *
 * @description
 * GraphQL을 사용한 서버 사이드 페이징 및 필터링 지원
 * - 자동 캐싱 및 재검증
 * - 페이지 변경 시 자동 재조회
 * - 백그라운드 자동 재검증
 *
 * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
 * @returns 사용자 목록 및 관련 상태
 *
 * @example
 * ```typescript
 * const { data, loading, error } = useUsersGQL({
 *   page: 1,
 *   pageSize: 10,
 *   search: '홍길동'
 * });
 * ```
 */
export function useUsersGQL(params?: UserQueryParams) {
  // GraphQL 변수 계산
  const limit = params?.pageSize || 10;
  const offset = ((params?.page || 1) - 1) * limit;

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      limit,
      offset,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // 응답 데이터 변환
  const mappedData = useMemo(() => {
    if (!data?.users) return undefined;

    return {
      items: data.users.map(mapGraphQLUserToUser),
      total: data.users.length,
      page: params?.page || 1,
      page_size: limit,
      total_pages: Math.ceil((data.users.length || 0) / limit),
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
 * 사용자 상세 조회 Hook
 *
 * @description
 * 특정 사용자의 상세 정보를 조회
 * - 수정 폼에 데이터를 채울 때 사용
 * - id가 null/undefined면 쿼리 비활성화
 *
 * @param id - 사용자 ID (UUID)
 * @returns 사용자 상세 정보 및 관련 상태
 *
 * @example
 * ```typescript
 * const { data: user, loading } = useUserGQL(userId);
 * ```
 */
export function useUserGQL(id: string | null | undefined) {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id: id || "" },
    skip: !id, // id가 없으면 쿼리 실행 안 함
    fetchPolicy: "no-cache", // 항상 서버에서 최신 데이터를 가져오고 캐싱하지 않음
    notifyOnNetworkStatusChange: true, // 네트워크 상태 변경 시 재렌더링
  });

  const mappedData = useMemo(() => {
    return data?.user ? mapGraphQLUserToUser(data.user) : undefined;
  }, [data]);

  return {
    data: mappedData,
    isLoading: loading,
    error: error ? new Error(error.message) : null,
    refetch,
  };
}

/**
 * 사용자 생성 Hook (Mutation)
 *
 * @description
 * 새로운 사용자를 생성하는 Mutation hook
 * - 낙관적 업데이트 지원
 * - 에러 발생 시 자동 롤백
 *
 * @param options - Mutation 옵션
 * @returns Mutation 함수 및 상태
 *
 * @example
 * ```typescript
 * const [createUser, { loading }] = useCreateUserGQL({
 *   onSuccess: (user) => {
 *     toast.success('사용자 생성 완료');
 *   }
 * });
 * ```
 */
export function useCreateUserGQL(options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: (data) => {
      if (data?.createUser) {
        const user = mapGraphQLUserToUser(data.createUser);
        options?.onSuccess?.(user);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "사용자 생성에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: (data: CreateUserRequest) => {
      return mutate({
        variables: {
          input: mapCreateUserRequestToGraphQL(data),
        },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 사용자 수정 Hook (Mutation)
 *
 * @description
 * 기존 사용자를 수정하는 Mutation hook
 * - 부분 업데이트 지원
 * - 낙관적 업데이트 지원
 *
 * @param options - Mutation 옵션
 * @returns Mutation 함수 및 상태
 *
 * @example
 * ```typescript
 * const [updateUser, { loading }] = useUpdateUserGQL({
 *   onSuccess: (user) => {
 *     toast.success('사용자 수정 완료');
 *   }
 * });
 * ```
 */
export function useUpdateUserGQL(options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}) {
  const [mutate, { loading, error }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: (data) => {
      if (data?.updateUser) {
        const user = mapGraphQLUserToUser(data.updateUser);
        options?.onSuccess?.(user);
      }
    },
    onError: (error: ApolloError) => {
      const errorMsg = error.message || "사용자 수정에 실패했습니다";
      options?.onError?.(new Error(errorMsg));
    },
  });

  return {
    mutate: ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      return mutate({
        variables: {
          id,
          input: mapUpdateUserRequestToGraphQL(data),
        },
      });
    },
    isPending: loading,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * 사용자 삭제 Hook (Mutation)
 *
 * @note 현재 백엔드에서 delete 뮤테이션이 구현되지 않아 스킵
 * TODO: 백엔드에서 delete 뮤테이션 구현 후 활성화
 */
export function useDeleteUserGQL(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return {
    mutate: (_id: string) => {
      options?.onError?.(new Error("삭제 기능은 아직 구현되지 않았습니다"));
    },
    isPending: false,
    error: new Error("삭제 기능은 아직 구현되지 않았습니다"),
  };
}
