/**
 * @file use-users.ts
 * @description 사용자 관리 Apollo Client Hooks (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 사용자 CRUD 작업 hooks
 * - 서버 상태 관리 (캐싱, 동기화, 재요청)
 * - Optimistic Updates (낙관적 업데이트)
 * - 자동 에러 처리 및 재시도
 * - 무효화 및 재조회 자동화
 *
 * @architecture
 * ```
 * Component → Hook (여기) → Apollo Client → GraphQL Backend
 *              ↓
 *         Apollo Client
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

// GraphQL hooks를 export
export {
  useUsersGQL as useUsers,
  useUserGQL as useUser,
  useCreateUserGQL as useCreateUser,
  useUpdateUserGQL as useUpdateUser,
  useDeleteUserGQL as useDeleteUser,
} from "./use-users-graphql";
