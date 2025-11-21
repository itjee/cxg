"use client";

/**
 * Users List Page
 *
 * Manager Users 목록 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status/userType → status/userType 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState, useEffect } from "react";
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
  type User,
} from "@/features/idam/users";

export default function UsersPage() {
  // Store에서 UI 상태 가져오기
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setSelectedStatus,
    setCurrentPage,
    openForm,
    setSelectedId,
  } = useUsersStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    status: null,
    userType: null,
    mfaEnabled: null,
    forcePasswordChange: null,
    createdAt: null,
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

  // 필터에서 GraphQL 변수 추출
  const getMfaEnabled = (): boolean | undefined => {
    const mfaFilter = searchFilters.mfaEnabled;
    if (!mfaFilter || !Array.isArray(mfaFilter) || mfaFilter.length === 0) {
      return undefined;
    }
    // mfaEnabled 필터는 "true" 또는 "false" 문자열로 온다
    if (mfaFilter.includes("true") && !mfaFilter.includes("false")) {
      return true;
    }
    if (mfaFilter.includes("false") && !mfaFilter.includes("true")) {
      return false;
    }
    // 둘 다 선택되면 필터링 하지 않음
    return undefined;
  };

  const getForcePasswordChange = (): boolean | undefined => {
    const passwordFilter = searchFilters.forcePasswordChange;
    if (
      !passwordFilter ||
      !Array.isArray(passwordFilter) ||
      passwordFilter.length === 0
    ) {
      return undefined;
    }
    if (passwordFilter.includes("true") && !passwordFilter.includes("false")) {
      return true;
    }
    if (passwordFilter.includes("false") && !passwordFilter.includes("true")) {
      return false;
    }
    return undefined;
  };

  // 생성일시 필터에서 from/to 날짜 추출
  const getCreatedDateRange = (): {
    createdAfter?: string;
    createdBefore?: string;
  } => {
    const createdAtFilter = searchFilters.createdAt;
    if (
      !createdAtFilter ||
      typeof createdAtFilter !== "object" ||
      !("value" in createdAtFilter)
    ) {
      return {};
    }

    const { from, to } = (
      createdAtFilter as { type: string; value: { from?: string; to?: string } }
    ).value;
    return {
      createdAfter: from,
      createdBefore: to,
    };
  };

  const dateRange = getCreatedDateRange();

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: usersResponse,
    loading,
    refetch,
  } = useUsers({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    userType: Array.isArray(searchFilters.userType)
      ? searchFilters.userType.join(",")
      : undefined,
    status: Array.isArray(searchFilters.status)
      ? searchFilters.status.join(",")
      : undefined,
    search: debouncedSearchText || undefined,
    mfaEnabled: getMfaEnabled(),
    forcePasswordChange: getForcePasswordChange(),
    createdAfter: dateRange.createdAfter,
    createdBefore: dateRange.createdBefore,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateUser, { loading: updating }] = useUpdateUser();

  // 사용자 데이터
  const users = usersResponse?.users || [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useUsers가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
      userType: null,
      mfaEnabled: null,
      forcePasswordChange: null,
      createdAt: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    setDebouncedSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (user: User) => {
    // 선택된 사용자 ID를 store에 저장하고 폼 오픈
    openForm(user.id);
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

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <UsersFilter
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <UsersTable
        data={users}
        isLoading={updating}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <UsersEdit />
    </div>
  );
}
