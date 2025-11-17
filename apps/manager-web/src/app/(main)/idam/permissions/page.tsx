'use client';

/**
 * Permissions List Page
 *
 * 권한 관리 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - isActive → active 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState } from 'react';
import { toast } from 'sonner';
import {
  PermissionsHeader,
  PermissionsStats,
  PermissionsFilter,
  PermissionsTable,
  PermissionsEdit,
  usePermissions,
  useDeletePermissions,
  type PermissionsFilterState,
} from '@/features/idam/permissions';
import { usePermissionsStore } from '@/features/idam/permissions/stores/permissions.store';

export default function PermissionsPage() {
  const { currentPage, itemsPerPage, setSearchText, setSelectedStatus } = usePermissionsStore();

  // 로컬 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 확정)
  const [localFilters, setLocalFilters] = useState<PermissionsFilterState>({
    isActive: null,
  });

  // 서버에 전달할 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<PermissionsFilterState>({
    isActive: null,
  });

  const [searchText, setSearchTextLocal] = useState("");

  const { data: permissionsResponse, refetch } = usePermissions({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    active: appliedFilters.isActive === 'true' ? true : appliedFilters.isActive === 'false' ? false : undefined,
  });

  const deletePermissionMutation = useDeletePermissions({
    onSuccess: () => toast.success('권한이 삭제되었습니다'),
    onError: (error) => toast.error(error.message || '권한 삭제에 실패했습니다'),
  });

  const permissions = permissionsResponse?.items || [];
  const totalItems = permissionsResponse?.total || 0;

  const handleSearchChange = (text: string) => {
    setSearchTextLocal(text);
    setSearchText(text);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    const statusValue = localFilters.isActive === 'true' ? 'active' : localFilters.isActive === 'false' ? 'inactive' : '';
    setSelectedStatus(statusValue as 'active' | 'inactive' | '');
  };

  return (
    <div className="space-y-6">
      <PermissionsHeader onRefresh={() => refetch()} />
      <PermissionsStats permissions={permissions} />

      {/* Jira 스타일 검색 + 필터 */}
      <PermissionsFilter
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
      />

      <PermissionsTable
        data={permissions}
        totalItems={totalItems}
        onEdit={(permission) => usePermissionsStore.getState().openForm(permission.id)}
        onDelete={(permission) => {
          if (confirm(`'${permission.name}' 권한을 삭제하시겠습니까?`)) {
            deletePermissionMutation.mutate(permission.id);
          }
        }}
      />
      <PermissionsEdit permissions={permissions} />
    </div>
  );
}
