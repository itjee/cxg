"use client";

/**
 * Roles List Page
 *
 * 역할 관리 페이지
 * Jira 스타일 필터링: 쿼리 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - queryText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
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

  // 쿼리 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [queryFilters, setQueryFilters] = useState<Record<string, string[] | null>>({
    status: null,
    category: null,
  });

  const [queryText, setQueryTextLocal] = useState("");
  const [debouncedQueryText, setDebouncedQueryText] = useState("");

  // 쿼리 텍스트 debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQueryText(queryText);
      setSearchText(queryText);
    }, 500);

    return () => clearTimeout(timer);
  }, [queryText, setSearchText]);

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: rolesResponse,
    loading,
    refetch,
  } = useRoles({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    category: queryFilters.category ? queryFilters.category.join(",") : undefined,
    status: queryFilters.status ? queryFilters.status.join(",") : undefined,
    search: debouncedQueryText || undefined,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateRole, { loading: updating }] = useUpdateRole();

  // 역할 데이터
  const roles = rolesResponse?.roles || [];

  const handleQueryTextChange = (text: string) => {
    setQueryTextLocal(text);
  };

  const handleApplyQuery = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 queryFilters 상태 업데이트로 useRoles가 자동으로 refetch됨
  };

  const handleClearAllFilters = () => {
    // 모든 필터 초기화
    setQueryFilters({
      status: null,
      category: null,
    });
    // 쿼리 텍스트도 초기화
    setSearchText("");
    setQueryTextLocal("");
    setDebouncedQueryText("");
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

      {/* Jira 스타일 쿼리 + 필터 팝업 */}
      <RolesFilter
        queryText={queryText}
        onQueryTextChange={handleQueryTextChange}
        queryFilters={queryFilters}
        onQueryFiltersChange={setQueryFilters}
        onApplyQuery={handleApplyQuery}
        onClearAllFilters={handleClearAllFilters}
      />

      <RolesTable data={roles} isLoading={updating} onEdit={handleEdit} onDelete={handleDelete} />
      <RolesEdit />
    </div>
  );
}
