"use client";

/**
 * Tenants List Page
 *
 * Manager Tenants 목록 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status → status 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  TenantsHeader,
  TenantsStats,
  TenantsFilter,
  TenantsTable,
  TenantsEdit,
  useTenants,
  useDeleteTenant,
  useTenantsStore,
  type Tenant,
} from "@/features/tnnt/tenants";

export default function TenantsPage() {
  // Store에서 UI 상태 가져오기
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setCurrentPage,
    openForm,
  } = useTenantsStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    status: null,
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

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: tenantsResponse,
    loading,
    refetch,
  } = useTenants({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: Array.isArray(searchFilters.status)
      ? (searchFilters.status[0] as any)
      : undefined,
    search: debouncedSearchText || undefined,
  });

  // GraphQL 뮤테이션 - 삭제
  const [deleteTenant] = useDeleteTenant();

  // 테넌트 데이터
  const tenants = tenantsResponse?.tenants || [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useTenants가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    setDebouncedSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (tenant: Tenant) => {
    // 선택된 테넌트 ID를 store에 저장하고 폼 오픈
    openForm(tenant.id);
  };

  const handleDelete = async (tenant: Tenant) => {
    if (confirm(`테넌트 "${tenant.name}"를 삭제하시겠습니까?`)) {
      const loadingToast = toast.loading("테넌트를 삭제 중입니다...");
      try {
        await deleteTenant({
          variables: {
            id: tenant.id,
          },
        });
        toast.dismiss(loadingToast);
        toast.success("테넌트가 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("테넌트 삭제에 실패했습니다");
        console.error("Failed to delete tenant:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <TenantsHeader onRefresh={refetch} />
      <TenantsStats data={tenants} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <TenantsFilter
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <TenantsTable
        data={tenants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TenantsEdit onSuccess={() => refetch()} />
    </div>
  );
}
