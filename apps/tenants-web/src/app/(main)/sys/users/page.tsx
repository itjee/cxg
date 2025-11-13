/**
 * @file page.tsx
 * @description 사용자 관리 페이지
 * 
 * 시스템 사용자 계정을 조회, 생성, 수정, 삭제할 수 있는 관리 페이지
 * 서버 사이드 페이징 및 필터링을 통해 대량의 데이터를 효율적으로 처리
 * 
 * @features
 * - 서버 사이드 페이징: 필요한 데이터만 조회하여 성능 최적화
 * - 실시간 필터링: 역할, 상태, 검색어 기준 필터링
 * - CRUD 작업: 사용자 생성, 조회, 수정, 삭제
 * - 통계 대시보드: 활성/비활성 사용자 현황
 * - 반응형 UI: 모바일/태블릿/데스크톱 지원
 * 
 * @architecture
 * ```
 * UsersPage (Container)
 *   ├─ useUserStore (Zustand): UI 상태 관리 (필터, 페이징, 모달)
 *   ├─ useUsers (TanStack Query): 서버 데이터 조회 및 캐싱
 *   ├─ useDeleteUser (TanStack Query): 삭제 mutation
 *   └─ Components
 *       ├─ UsersHeader: 페이지 제목 및 액션 버튼
 *       ├─ UsersStats: 사용자 통계 카드
 *       ├─ UsersFilters: 검색 및 필터 UI
 *       ├─ UsersTable: 데이터 테이블 + 페이지네이션 (통합)
 *       └─ UsersEdit: 생성/수정 모달 폼
 * ```
 */

'use client';

import { toast } from 'sonner';
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useDeleteUser,
} from '@/features/sys/users';
import { useUserStore } from '@/features/sys/users/stores';

/**
 * 사용자 관리 페이지 컴포넌트
 * 
 * @description
 * 시스템 사용자의 전체 생명주기를 관리하는 메인 페이지
 * - Zustand로 UI 상태(필터, 페이징) 관리
 * - TanStack Query로 서버 데이터 관리 및 캐싱
 * - 서버 사이드 페이징으로 성능 최적화
 * 
 * @example
 * ```tsx
 * // app/(main)/sys/users/page.tsx
 * export default function UsersPage() { ... }
 * ```
 */
export default function UsersPage() {
  /**
   * Zustand 스토어에서 UI 상태 가져오기
   * - selectedRole: 선택된 역할 필터
   * - selectedStatus: 선택된 상태 필터 ('active' | 'inactive' | '')
   * - currentPage: 현재 페이지 (0-based)
   * - itemsPerPage: 페이지당 항목 수
   * - globalFilter: 검색어
   */
  const {
    selectedRole,
    selectedStatus,
    currentPage,
    itemsPerPage,
    globalFilter,
  } = useUserStore();

  /**
   * 서버 사이드 페이징 및 필터링으로 사용자 목록 조회
   * 
   * @hook useUsers
   * @param page - 페이지 번호 (1-based, 서버 API 요구사항)
   * @param pageSize - 페이지당 항목 수
   * @param search - 검색어 (username, email, full_name 검색)
   * @param active - 활성 상태 필터 (true | false | undefined)
   * @param roleId - 역할 ID 필터
   * 
   * @returns
   * - data: 페이징된 사용자 목록 및 메타데이터
   * - isLoading: 로딩 상태
   * - error: 에러 객체
   * - refetch: 수동 재조회 함수
   * 
   * @cache
   * - staleTime: 5분 (데이터 신선도 유지)
   * - gcTime: 10분 (캐시 유지 시간)
   */
  const { data: usersResponse, isLoading, error, refetch } = useUsers({
    page: currentPage + 1, // 0-based → 1-based 변환
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
    roleId: selectedRole || undefined,
  });

  /**
   * 사용자 삭제 mutation
   * 
   * @hook useDeleteUser
   * @optimistic Optimistic Update 적용
   *   - 삭제 전: 목록에서 미리 제거 (낙관적 업데이트)
   *   - 성공 시: 캐시 무효화 및 재조회
   *   - 실패 시: 이전 상태로 롤백
   * 
   * @callbacks
   * - onSuccess: 성공 시 토스트 알림
   * - onError: 실패 시 에러 토스트
   */
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success('사용자가 삭제되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '사용자 삭제에 실패했습니다');
    },
  });

  /**
   * 응답 데이터 안전하게 추출
   * - users: 현재 페이지의 사용자 목록
   * - totalItems: 전체 사용자 수 (페이지네이션 계산용)
   */
  const users = usersResponse?.items || [];
  const totalItems = usersResponse?.total || 0;

  /**
   * 데이터 새로고침 핸들러
   * TanStack Query의 refetch 함수 호출하여 캐시 무효화 및 재조회
   */
  const handleRefresh = () => refetch();

  /**
   * 페이지 레이아웃 렌더링
   * 
   * @layout Vertical Stack (space-y-6)
   * 
   * @components
   * 1. UsersHeader: 페이지 제목 + 새로고침/추가/내보내기 버튼
   * 2. UsersStats: 통계 카드 (전체/활성/비활성/최근접속)
   * 3. UsersFilters: 검색 및 필터 (역할, 상태)
   * 4. UsersTable: 데이터 테이블 + 페이지네이션 (통합)
   * 5. UsersEdit: 생성/수정 모달 폼 (전역 상태로 제어)
   * 
   * @handlers
   * - onRefresh: 데이터 새로고침
   * - onEdit: 수정 모달 오픈 (useUserStore.openForm)
   * - onDelete: 삭제 확인 후 mutation 실행
   */
  return (
    <div className="space-y-6">
      {/* 페이지 헤더: 제목 및 주요 액션 버튼 */}
      <UsersHeader onRefresh={handleRefresh} />

      {/* 통계 카드: 사용자 현황 요약 */}
      <UsersStats users={users} />

      {/* 필터 UI: 검색, 역할, 상태 필터링 */}
      <UsersFilters users={users} />

      {/* 데이터 테이블 + 페이지네이션: 사용자 목록 및 액션 */}
      <UsersTable
        data={users}
        totalItems={totalItems}
        onEdit={(user) => useUserStore.getState().openForm(user.id)}
        onDelete={(user) => {
          if (confirm(`'${user.full_name || user.username}' 사용자를 삭제하시겠습니까?`)) {
            deleteUserMutation.mutate(user.id);
          }
        }}
      />

      {/* 생성/수정 모달: 전역 상태(formOpen)로 제어 */}
      <UsersEdit users={users} />
    </div>
  );
}
