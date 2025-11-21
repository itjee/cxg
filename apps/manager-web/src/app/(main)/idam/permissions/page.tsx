"use client";

/**
 * Permissions List Page
 *
 * Manager Permissions 목록 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status/category → status/category 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  PermissionsHeader,
  PermissionsStats,
  PermissionsFilter,
  PermissionsTable,
  PermissionEdit,
  usePermissions,
  useUpdatePermission,
  usePermissionsStore,
  type Permission,
} from "@/features/idam/permissions";

export default function PermissionsPage() {
  // Store에서 UI 상태 가져오기
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setCurrentPage,
    openForm,
    setSelectedId,
  } = usePermissionsStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    status: null,
    category: null,
    isSystem: null,
  });

  const [searchText, setSearchTextLocal] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // 검색 텍스트 debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setSearchText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, setSearchText]);

  // isSystem 필터에서 boolean 값 추출
  const getIsSystem = (): boolean | undefined => {
    const systemFilter = searchFilters.isSystem;
    if (
      !systemFilter ||
      !Array.isArray(systemFilter) ||
      systemFilter.length === 0
    ) {
      return undefined;
    }
    if (systemFilter.includes("true") && !systemFilter.includes("false")) {
      return true;
    }
    if (systemFilter.includes("false") && !systemFilter.includes("true")) {
      return false;
    }
    return undefined;
  };

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: permissionsResponse,
    loading,
    refetch,
  } = usePermissions({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    category: Array.isArray(searchFilters.category)
      ? searchFilters.category.join(",")
      : undefined,
    status: Array.isArray(searchFilters.status)
      ? searchFilters.status.join(",")
      : undefined,
    search: debouncedSearchText || undefined,
    isSystem: getIsSystem(),
  });

  // GraphQL 뮤테이션 - 수정
  const [updatePermission, { loading: updating }] = useUpdatePermission();

  // 권한 데이터
  const permissions = permissionsResponse?.permissions || [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 usePermissions가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
      category: null,
      isSystem: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    setDebouncedSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (permission: Permission) => {
    // 선택된 권한 ID를 store에 저장하고 폼 오픈
    openForm(permission.id);
  };

  const handleDelete = async (permission: any) => {
    if (confirm(`'${permission.name}' 권한을 삭제하시겠습니까?`)) {
      try {
        await updatePermission({
          variables: {
            id: permission.id,
            input: {
              name: permission.name,
              category: permission.category,
              resource: permission.resource,
              action: permission.action,
              status: "INACTIVE",
            },
          },
        });
        toast.success("권한이 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.error("권한 삭제에 실패했습니다");
        console.error("Failed to delete permission:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <PermissionsHeader onRefresh={() => refetch()} />
      <PermissionsStats data={permissions} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <PermissionsFilter
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <PermissionsTable
        data={permissions}
        isLoading={updating}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PermissionEdit />
    </div>
  );
}
