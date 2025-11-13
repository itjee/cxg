/**
 * @file use-users.hooks.ts
 * @description Users Apollo Hooks
 * 
 * Apollo Client의 React Hooks를 사용하여 Users 데이터 관리
 */

import { useQuery, useMutation, QueryHookOptions, MutationHookOptions } from '@apollo/client';
import {
  GET_MANAGER_USERS,
  GET_MANAGER_USER,
  CREATE_MANAGER_USER,
  UPDATE_MANAGER_USER,
  type GetManagerUsersVariables,
  type GetManagerUserVariables,
  type CreateManagerUserVariables,
  type UpdateManagerUserVariables,
} from '@/lib/graphql/users.graphql';
import type { Users } from '../types/users.types';

/**
 * 사용자 목록 조회 Hook
 */
export function useManagerUsers(
  variables?: GetManagerUsersVariables,
  options?: QueryHookOptions<{ managerUsers: Users[] }, GetManagerUsersVariables>
) {
  return useQuery<{ managerUsers: Users[] }, GetManagerUsersVariables>(
    GET_MANAGER_USERS,
    {
      variables,
      ...options,
    }
  );
}

/**
 * 사용자 단건 조회 Hook
 */
export function useManagerUser(
  id: string,
  options?: QueryHookOptions<{ managerUser: Users }, GetManagerUserVariables>
) {
  return useQuery<{ managerUser: Users }, GetManagerUserVariables>(
    GET_MANAGER_USER,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
      ...options,
    }
  );
}

/**
 * 사용자 생성 Mutation Hook
 */
export function useCreateManagerUser(
  options?: MutationHookOptions<{ createManagerUser: Users }, CreateManagerUserVariables>
) {
  return useMutation<{ createManagerUser: Users }, CreateManagerUserVariables>(
    CREATE_MANAGER_USER,
    {
      // 생성 후 목록 자동 갱신
      refetchQueries: [{ query: GET_MANAGER_USERS }],
      ...options,
    }
  );
}

/**
 * 사용자 수정 Mutation Hook
 */
export function useUpdateManagerUser(
  options?: MutationHookOptions<{ updateManagerUser: Users }, UpdateManagerUserVariables>
) {
  return useMutation<{ updateManagerUser: Users }, UpdateManagerUserVariables>(
    UPDATE_MANAGER_USER,
    options
  );
}

/**
 * 사용자 삭제 Hook (status를 INACTIVE로 변경)
 */
export function useDeleteManagerUser() {
  const [updateUser, { loading, error }] = useUpdateManagerUser();

  const deleteUser = async (id: string) => {
    return updateUser({
      variables: {
        id,
        input: { status: 'INACTIVE' },
      },
      refetchQueries: [{ query: GET_MANAGER_USERS }],
    });
  };

  return { deleteUser, loading, error };
}
