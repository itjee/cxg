"use client";

/**
 * Roles List Page
 *
 * 역할 관리 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - isActive → status 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState } from "react";
import { toast } from "sonner";
import {
  RolesHeader,
  RolesStats,
  RolesFilter,
  RolesTable,
  RolesEdit,
  useRoles,
  useDeleteRole,
  type RolesFilterState,
} from "@/features/idam/roles";
import { useRolesStore } from "@/features/idam/roles/stores/roles.store";

export default function RolesPage() {
  const { setSearchText, setSelectedStatus } = useRolesStore();

  // 로컬 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 확정)
  const [localFilters, setLocalFilters] = useState<RolesFilterState>({
    isActive: null,
  });

  // 서버에 전달할 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<RolesFilterState>({
    isActive: null,
  });

  const [searchText, setSearchTextLocal] = useState("");

  const { data: rolesResponse, refetch, loading } = useRoles({
    limit: 20,
    offset: 0,
    status: appliedFilters.isActive || undefined,
    search: searchText || undefined,
  });

  const [deleteRole] = useDeleteRole();

  const roles = rolesResponse?.roles || [];

  const handleSearchChange = (text: string) => {
    setSearchTextLocal(text);
    setSearchText(text);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setSelectedStatus(localFilters.isActive || null);
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (confirm(`'${roleName}' 역할을 삭제하시겠습니까?`)) {
      try {
        await deleteRole({
          variables: { id: roleId },
        });
        toast.success("역할이 삭제되었습니다");
      } catch (error) {
        const message = error instanceof Error ? error.message : "역할 삭제에 실패했습니다";
        toast.error(message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <RolesHeader onRefresh={() => refetch?.()} />
      <RolesStats data={roles} />

      {/* Jira 스타일 검색 + 필터 */}
      <RolesFilter
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
      />

      <RolesTable
        data={roles}
        isLoading={loading}
        onEdit={(role) => useRolesStore.getState().openForm(role.id)}
        onDelete={(role) => handleDeleteRole(role.id, role.name)}
      />
      <RolesEdit />
    </div>
  );
}
