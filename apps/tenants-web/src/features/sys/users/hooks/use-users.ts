/**
 * @file use-users.ts
 * @description 사용자 관리 TanStack Query Hooks
 * 
 * 사용자 CRUD 작업을 위한 React Query hooks 모음
 * - 서버 상태 관리 (캐싱, 동기화, 재요청)
 * - Optimistic Updates (낙관적 업데이트)
 * - 자동 에러 처리 및 재시도
 * - 무효화 및 재조회 자동화
 * 
 * @architecture
 * ```
 * Component → Hook (여기) → Service → Backend API
 *              ↓
 *         TanStack Query
 *         (캐싱, 동기화)
 * ```
 * 
 * @hooks
 * - useUsers: 목록 조회 (서버 사이드 페이징)
 * - useUser: 상세 조회
 * - useCreateUser: 생성 mutation
 * - useUpdateUser: 수정 mutation
 * - useDeleteUser: 삭제 mutation
 * - useToggleUserActive: 활성/비활성 mutation
 * 
 * @example
 * ```typescript
 * // 목록 조회
 * const { data, isLoading } = useUsers({ page: 1, pageSize: 10 });
 * 
 * // 생성
 * const createMutation = useCreateUser({
 *   onSuccess: () => toast.success('생성 완료')
 * });
 * createMutation.mutate(newUser);
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/users.service";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
} from "../types";

/**
 * Query Key Factory
 * 
 * @description
 * TanStack Query의 캐시 키를 생성하는 팩토리 함수들
 * - 일관된 키 네이밍 규칙
 * - 타입 안전한 키 생성
 * - 무효화 및 재조회 시 사용
 * 
 * @structure
 * ```
 * ['users']                          // 전체 users 쿼리
 * ['users', 'list']                  // 모든 목록 쿼리
 * ['users', 'list', { page: 1 }]     // 특정 목록 쿼리
 * ['users', 'detail']                // 모든 상세 쿼리
 * ['users', 'detail', 'user-id']     // 특정 상세 쿼리
 * ```
 * 
 * @example
 * ```typescript
 * // 전체 users 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: usersKeys.all });
 * 
 * // 특정 목록 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: usersKeys.list(params) });
 * 
 * // 특정 사용자 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
 * ```
 */
const usersKeys = {
  /** 전체 users 쿼리 키 */
  all: ["users"] as const,
  
  /** 모든 목록 쿼리 키 */
  lists: () => [...usersKeys.all, "list"] as const,
  
  /** 특정 파라미터의 목록 쿼리 키 */
  list: (params?: UserQueryParams) => [...usersKeys.lists(), params] as const,
  
  /** 모든 상세 쿼리 키 */
  details: () => [...usersKeys.all, "detail"] as const,
  
  /** 특정 사용자의 상세 쿼리 키 */
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

/**
 * 사용자 목록 조회 Hook
 * 
 * @description
 * 서버 사이드 페이징 및 필터링을 지원하는 사용자 목록 조회
 * - 자동 캐싱 (staleTime: 5분, gcTime: 10분)
 * - 페이지 변경 시 자동 재조회
 * - 백그라운드 자동 재검증
 * - 지수 백오프 재시도 (최대 2회)
 * 
 * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
 * @param params.page - 페이지 번호 (1-based)
 * @param params.pageSize - 페이지 크기 (기본: 10)
 * @param params.search - 검색어 (username, email, full_name)
 * @param params.active - 활성 상태 필터 (true/false)
 * @param params.roleId - 역할 ID 필터
 * 
 * @returns UseQueryResult<UserListResponse>
 * - data: 사용자 목록 및 메타데이터
 * - isLoading: 최초 로딩 상태
 * - isFetching: 백그라운드 fetching 상태
 * - error: 에러 객체 (ApiError)
 * - refetch: 수동 재조회 함수
 * 
 * @cache
 * - staleTime: 5분 (5분간 캐시 데이터 사용)
 * - gcTime: 10분 (10분간 캐시 유지)
 * - retry: 2회 (지수 백오프)
 * 
 * @example
 * ```typescript
 * // 기본 사용
 * const { data, isLoading, error } = useUsers();
 * 
 * // 페이징 + 필터링
 * const { data } = useUsers({
 *   page: 2,
 *   pageSize: 20,
 *   search: '홍길동',
 *   active: true,
 *   roleId: 'role-001'
 * });
 * 
 * // 데이터 접근
 * const users = data?.items || [];
 * const totalPages = data?.total_pages || 0;
 * ```
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => userService.listUsers(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 사용자 상세 조회 Hook
 * 
 * @description
 * 특정 사용자의 상세 정보를 조회
 * - 수정 폼에 데이터를 채울 때 사용
 * - id가 null/undefined면 쿼리 비활성화
 * - 존재하지 않는 ID는 404 에러 발생
 * 
 * @param id - 사용자 ID (UUID)
 * - null/undefined: 쿼리 비활성화 (enabled: false)
 * - string: 쿼리 활성화 및 실행
 * 
 * @returns UseQueryResult<User>
 * - data: 사용자 상세 정보
 * - isLoading: 로딩 상태
 * - error: 에러 객체 (ApiError)
 * 
 * @cache
 * - staleTime: 5분
 * - gcTime: 10분
 * - retry: 2회
 * 
 * @example
 * ```typescript
 * // 수정 모드
 * const { data: user, isLoading } = useUser(editingId);
 * 
 * // 조건부 조회 (id가 있을 때만)
 * const { data: user } = useUser(userId || null);
 * 
 * // 쿼리 비활성화
 * const { data } = useUser(null); // enabled: false
 * ```
 */
export function useUser(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? usersKeys.detail(id) : [],
    queryFn: () => userService.getUser(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 사용자 생성 Hook (Mutation)
 * 
 * @description
 * 새로운 사용자를 생성하는 Mutation hook
 * - Optimistic Update: 즉시 UI 업데이트 (실패 시 롤백)
 * - 자동 캐시 무효화: 생성 후 목록 재조회
 * - 에러 핸들링: onError 콜백으로 처리
 * 
 * @param options - Mutation 옵션
 * @param options.onSuccess - 생성 성공 시 콜백
 * @param options.onError - 생성 실패 시 콜백
 * 
 * @returns UseMutationResult
 * - mutate: 동기 mutation 함수
 * - mutateAsync: 비동기 mutation 함수
 * - isPending: 진행 중 상태
 * - isSuccess: 성공 상태
 * - error: 에러 객체
 * 
 * @optimistic-update
 * 1. onMutate: 진행 중인 쿼리 취소 + 임시 데이터 추가
 * 2. onSuccess: 실제 데이터로 교체 + 캐시 무효화
 * 3. onError: 이전 데이터로 롤백
 * 4. onSettled: 최종 캐시 무효화 (항상 실행)
 * 
 * @example
 * ```typescript
 * const createMutation = useCreateUser({
 *   onSuccess: (user) => {
 *     toast.success(`${user.username} 생성 완료`);
 *     closeModal();
 *   },
 *   onError: (error) => {
 *     if (error instanceof ApiError && error.code === 'ALREADY_EXISTS') {
 *       toast.error('이미 존재하는 사용자명입니다');
 *     }
 *   }
 * });
 * 
 * // 사용
 * createMutation.mutate({
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'password123',
 *   full_name: '홍길동'
 * });
 * ```
 */
export function useCreateUser(options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onMutate: async (newUser) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      // 이전 데이터 스냅샷
      const previousUsers = queryClient.getQueryData(usersKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...(old.data || []),
            { ...newUser, id: "temp-id", createdAt: new Date().toISOString() },
          ],
        };
      });

      return { previousUsers };
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.(newUser);
    },
    onError: (error, variables, context) => {
      // 롤백
      if (context?.previousUsers) {
        queryClient.setQueryData(usersKeys.lists(), context.previousUsers);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    retry: 1,
  });
}

/**
 * 사용자 수정 Hook (Mutation)
 * 
 * @description
 * 기존 사용자를 수정하는 Mutation hook
 * - Optimistic Update: 상세 + 목록 모두 즉시 업데이트
 * - 부분 업데이트 지원: 변경된 필드만 전송
 * - 자동 캐시 무효화: 수정 후 상세/목록 재조회
 * 
 * @param options - Mutation 옵션
 * @param options.onSuccess - 수정 성공 시 콜백
 * @param options.onError - 수정 실패 시 콜백
 * 
 * @returns UseMutationResult
 * - mutate: 동기 mutation 함수
 * - mutateAsync: 비동기 mutation 함수
 * - isPending: 진행 중 상태
 * - isSuccess: 성공 상태
 * - error: 에러 객체
 * 
 * @optimistic-update
 * 1. onMutate: 상세 쿼리 + 목록 쿼리 모두 업데이트
 * 2. onSuccess: 실제 데이터로 교체
 * 3. onError: 이전 데이터로 롤백 (상세 + 목록)
 * 4. onSettled: 상세 쿼리 무효화
 * 
 * @example
 * ```typescript
 * const updateMutation = useUpdateUser({
 *   onSuccess: (user) => {
 *     toast.success('수정 완료');
 *     closeModal();
 *   }
 * });
 * 
 * // 부분 업데이트
 * updateMutation.mutate({
 *   id: 'user-id',
 *   data: {
 *     email: 'newemail@example.com',
 *     phone: '010-9999-8888'
 *   }
 * });
 * ```
 */
export function useUpdateUser(options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      const previousUser = queryClient.getQueryData(usersKeys.detail(id));
      const previousList = queryClient.getQueryData(usersKeys.lists());

      // Optimistic Update - 상세
      queryClient.setQueryData(usersKeys.detail(id), (old: any) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      // Optimistic Update - 목록
      queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((user: User) =>
            user.id === id ? { ...user, ...data } : user
          ),
        };
      });

      return { previousUser, previousList, id };
    },
    onSuccess: (updatedUser, { id }) => {
      queryClient.setQueryData(usersKeys.detail(id), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.(updatedUser);
    },
    onError: (error, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(usersKeys.detail(id), context.previousUser);
      }
      if (context?.previousList) {
        queryClient.setQueryData(usersKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
    retry: 1,
  });
}

/**
 * 사용자 삭제 Hook (Mutation)
 * 
 * @description
 * 사용자를 삭제하는 Mutation hook
 * - Optimistic Update: 목록에서 즉시 제거 (실패 시 복구)
 * - 자동 캐시 무효화: 삭제 후 목록 재조회
 * - 상세 쿼리 제거: 삭제된 사용자의 캐시 완전 제거
 * 
 * @param options - Mutation 옵션
 * @param options.onSuccess - 삭제 성공 시 콜백
 * @param options.onError - 삭제 실패 시 콜백
 * 
 * @returns UseMutationResult
 * - mutate: 동기 mutation 함수
 * - mutateAsync: 비동기 mutation 함수
 * - isPending: 진행 중 상태
 * - isSuccess: 성공 상태
 * - error: 에러 객체
 * 
 * @optimistic-update
 * 1. onMutate: 목록에서 해당 사용자 제거
 * 2. onSuccess: 상세 쿼리 캐시 제거 + 목록 무효화
 * 3. onError: 이전 목록으로 롤백
 * 4. onSettled: 목록 쿼리 무효화
 * 
 * @example
 * ```typescript
 * const deleteMutation = useDeleteUser({
 *   onSuccess: () => {
 *     toast.success('삭제 완료');
 *   },
 *   onError: (error) => {
 *     toast.error('삭제 실패');
 *   }
 * });
 * 
 * // 사용
 * deleteMutation.mutate('user-id');
 * 
 * // 확인 후 삭제
 * if (confirm('정말 삭제하시겠습니까?')) {
 *   deleteMutation.mutate(userId);
 * }
 * ```
 */
export function useDeleteUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      const previousList = queryClient.getQueryData(usersKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((user: User) => user.id !== id),
        };
      });

      return { previousList, id };
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.();
    },
    onError: (error, id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(usersKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    retry: 1,
  });
}

/**
 * 사용자 활성/비활성 토글 Hook (Mutation)
 * 
 * @description
 * 사용자의 활성 상태를 토글하는 Mutation hook
 * - 활성: 로그인 가능
 * - 비활성: 로그인 불가
 * - Optimistic Update: 상세 + 목록 모두 즉시 업데이트
 * - 빠른 상태 변경용 (전체 수정보다 가벼움)
 * 
 * @param options - Mutation 옵션
 * @param options.onSuccess - 토글 성공 시 콜백 (새로운 active 상태 전달)
 * @param options.onError - 토글 실패 시 콜백
 * 
 * @returns UseMutationResult
 * - mutate: 동기 mutation 함수
 * - mutateAsync: 비동기 mutation 함수
 * - isPending: 진행 중 상태
 * - isSuccess: 성공 상태
 * - error: 에러 객체
 * 
 * @optimistic-update
 * 1. onMutate: 상세 + 목록의 active 필드 즉시 업데이트
 * 2. onSuccess: 성공 콜백 호출
 * 3. onError: 이전 상태로 롤백
 * 4. onSettled: 상세 + 목록 쿼리 무효화
 * 
 * @example
 * ```typescript
 * const toggleMutation = useToggleUserActive({
 *   onSuccess: (active) => {
 *     toast.success(active ? '활성화되었습니다' : '비활성화되었습니다');
 *   }
 * });
 * 
 * // 활성화
 * toggleMutation.mutate({ id: 'user-id', active: true });
 * 
 * // 비활성화
 * toggleMutation.mutate({ id: 'user-id', active: false });
 * 
 * // 토글 스위치와 연동
 * <Switch
 *   checked={user.is_active}
 *   onCheckedChange={(checked) => 
 *     toggleMutation.mutate({ id: user.id, active: checked })
 *   }
 * />
 * ```
 */
export function useToggleUserActive(options?: {
  onSuccess?: (active: boolean) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      userService.toggleUserActive(id, active),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      const previousUser = queryClient.getQueryData(usersKeys.detail(id));
      const previousList = queryClient.getQueryData(usersKeys.lists());

      // Optimistic Update
      queryClient.setQueryData(usersKeys.detail(id), (old: any) => {
        if (!old) return old;
        return { ...old, active };
      });

      queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((user: User) =>
            user.id === id ? { ...user, active } : user
          ),
        };
      });

      return { previousUser, previousList, id };
    },
    onSuccess: (_, { active }) => {
      options?.onSuccess?.(active);
    },
    onError: (error, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(usersKeys.detail(id), context.previousUser);
      }
      if (context?.previousList) {
        queryClient.setQueryData(usersKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    retry: 1,
  });
}
