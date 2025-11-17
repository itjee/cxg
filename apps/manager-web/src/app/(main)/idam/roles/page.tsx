"use client";

/**
 * Roles List Page
 *
 * 역할 관리 페이지
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
  RolesHeader,
  RolesStats,
  RolesFilter,
  RolesTable,
  RolesEdit,
  useRoles,
  useUpdateRole,
  useRolesStore,
  type Role,
} from "@/features/idam/roles";

export default function RolesPage() {
  // Store에서 UI 상태 가져오기
  const { currentPage, itemsPerPage, setSearchText, setCurrentPage, openForm, setSelectedId } =
    useRolesStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<Record<string, string[] | null>>({
    status: null,
    category: null,
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
    data: rolesResponse,
    loading,
    refetch,
  } = useRoles({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    category: searchFilters.category ? searchFilters.category.join(",") : undefined,
    status: searchFilters.status ? searchFilters.status.join(",") : undefined,
    search: debouncedSearchText || undefined,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateRole, { loading: updating }] = useUpdateRole();

  // 역할 데이터
  const roles = rolesResponse?.roles || [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useRoles가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
      category: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    setDebouncedSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (role: Role) => {
    // 선택된 역할 ID를 store에 저장
    setSelectedId(role.id);
    // 수정 폼 오픈
    openForm();
  };

  const handleDelete = async (role: Role) => {
    if (confirm(`'${role.name}' 역할을 삭제하시겠습니까?`)) {
      try {
        await updateRole({
          variables: {
            id: role.id,
            input: { status: "INACTIVE" },
          },
        });
        toast.success("역할이 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.error("역할 삭제에 실패했습니다");
        console.error("Failed to delete role:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <RolesHeader onRefresh={() => refetch()} />
      <RolesStats data={roles} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <RolesFilter
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <RolesTable data={roles} isLoading={updating} onEdit={handleEdit} onDelete={handleDelete} />
      <RolesEdit />
    </div>
  );
}
