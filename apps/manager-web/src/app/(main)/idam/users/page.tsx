"use client";

/**
 * Users List Page
 *
 * Manager Users 목록 페이지
 * Jira 스타일 필터링: 쿼리 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - queryText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status/userType → status/userType 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState } from "react";
import { toast } from "sonner";
import {
  UsersHeader,
  UsersStats,
  UsersFilter,
  UsersTable,
  UsersEdit,
  useUsers,
  useUpdateUser,
  useUsersStore,
  type UsersFilterState,
} from "@/features/idam/users";

export default function UsersPage() {
  // Store에서 UI 상태 가져오기
  const { currentPage, itemsPerPage, setSearchText, setSelectedStatus } =
    useUsersStore();

  // 쿼리 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [queryFilters, setQueryFilters] = useState<Record<string, string[] | null>>({
    status: null,
    userType: null,
  });

  const [queryText, setQueryTextLocal] = useState("");

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: usersResponse,
    loading,
    refetch,
  } = useUsers({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    userType: queryFilters.userType ? queryFilters.userType.join(",") : undefined,
    status: queryFilters.status ? queryFilters.status.join(",") : undefined,
    search: queryText || undefined,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateUser, { loading: updating }] = useUpdateUser();

  // 사용자 데이터
  const users = usersResponse?.users || [];

  const handleQueryTextChange = (text: string) => {
    setQueryTextLocal(text);
    setSearchText(text);
  };

  const handleApplyQuery = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 queryFilters 상태 업데이트로 useUsers가 자동으로 refetch됨
  };

  const handleClearAllFilters = () => {
    // 모든 필터 초기화
    setQueryFilters({
      status: null,
      userType: null,
    });
    // 쿼리 텍스트도 초기화
    setSearchText("");
    setQueryTextLocal("");
  };

  const handleDelete = async (user: any) => {
    if (confirm(`'${user.fullName}' 사용자를 삭제하시겠습니까?`)) {
      try {
        await updateUser({
          variables: {
            id: user.id,
            input: { status: "INACTIVE" },
          },
        });
        toast.success("사용자가 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.error("사용자 삭제에 실패했습니다");
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={() => refetch()} />
      <UsersStats data={users} />

      {/* Jira 스타일 쿼리 + 필터 팝업 */}
      <UsersFilter
        queryText={queryText}
        onQueryTextChange={handleQueryTextChange}
        queryFilters={queryFilters}
        onQueryFiltersChange={setQueryFilters}
        onApplyQuery={handleApplyQuery}
        onClearAllFilters={handleClearAllFilters}
      />

      <UsersTable data={users} isLoading={updating} onDelete={handleDelete} />
      <UsersEdit />
    </div>
  );
}
