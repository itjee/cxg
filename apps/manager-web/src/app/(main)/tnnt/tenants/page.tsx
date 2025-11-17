/**
 * @file page.tsx
 * @description 테넌트 관리 페이지
 *
 * Feature-Driven Architecture 패턴 적용
 * - Page Component: 데이터 로딩 및 상태 관리
 * - Feature Components: UI 렌더링
 * - Hooks: 서버 상태 (TanStack Query) & UI 상태 (Zustand)
 * - Services: API 호출
 */

'use client';

import { toast } from 'sonner';
import {
  TenantsHeader,
  TenantsStats,
  TenantsFilters,
  TenantsTable,
  TenantsEdit,
  useTenants,
  useDeleteTenant,
  useTenantsStore,
} from '@/features/tnnt/tenants';
import type { Tenant } from '@/features/tnnt/tenants/types';

export default function TenantsPage() {
  // UI 상태 (필터, 페이징, 모달)
  const {
    searchText,
    selectedStatus,
    selectedType,
    selectedIsSuspended,
    currentPage,
    itemsPerPage,
    openForm,
  } = useTenantsStore();

  // 서버 상태 (테넌트 목록) - TanStack Query
  const {
    data: tenantsResponse,
    isLoading,
    error,
    refetch,
  } = useTenants({
    page: currentPage + 1, // 0-based to 1-based pagination conversion
    pageSize: itemsPerPage,
    search: searchText,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
  });

  // 삭제 mutation
  const deleteMutation = useDeleteTenant();

  // 테넌트 목록 추출
  const tenants = tenantsResponse?.items || [];

  /**
   * 테넌트 수정 핸들러
   */
  const handleEdit = (tenant: Tenant) => {
    openForm(tenant.id);
  };

  /**
   * 테넌트 삭제 핸들러
   */
  const handleDelete = (tenant: Tenant) => {
    if (confirm(`테넌트 "${tenant.name}"를 정말 삭제하시겠습니까?`)) {
      deleteMutation.mutate(tenant.id, {
        onSuccess: () => {
          toast.success('테넌트가 삭제되었습니다');
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || '테넌트 삭제에 실패했습니다');
        },
      });
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">테넌트 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">
            오류가 발생했습니다: {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="text-primary hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <TenantsHeader onRefresh={() => refetch()} />

      {/* 통계 카드 */}
      <TenantsStats data={tenants} />

      {/* 검색 및 필터 */}
      <TenantsFilters data={tenants} />

      {/* 데이터 테이블 */}
      <TenantsTable
        data={tenants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 생성/수정 Drawer */}
      <TenantsEdit />
    </div>
  );
}
