"use client";

/**
 * Sessions List Page
 *
 * Manager Sessions 목록 페이지
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
  SessionsHeader,
  SessionsStats,
  SessionsFilter,
  SessionsTable,
  SessionsEdit,
  useSessions,
  useUpdateSession,
  useSessionsStore,
  type SessionsFilterState,
  type Session,
} from "@/features/idam/sessions";

export default function SessionsPage() {
  // Store에서 UI 상태 가져오기
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setSelectedStatus,
    setCurrentPage,
    openForm,
    setSelectedId,
  } = useSessionsStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    status: null,
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
    data: sessionsResponse,
    loading,
    refetch,
  } = useSessions({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: Array.isArray(searchFilters.status)
      ? searchFilters.status.join(",")
      : undefined,
    search: debouncedSearchText || undefined,
    createdAfter: dateRange.createdAfter,
    createdBefore: dateRange.createdBefore,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateSession, { loading: updating }] = useUpdateSession();

  // 세션 데이터
  const sessions = sessionsResponse?.sessions || [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useSessions가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
      createdAt: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    setDebouncedSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (session: Session) => {
    // 선택된 세션 ID를 store에 저장하고 폼 오픈
    openForm(session.id);
  };

  const handleDelete = async (session: any) => {
    if (confirm(`세션 '${session.userId}' 을(를) 삭제하시겠습니까?`)) {
      try {
        await updateSession({
          variables: {
            id: session.id,
            input: { status: "TERMINATED" },
          },
        });
        toast.success("세션이 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.error("세션 삭제에 실패했습니다");
        console.error("Failed to delete session:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <SessionsHeader onRefresh={() => refetch()} />
      <SessionsStats data={sessions} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <SessionsFilter
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <SessionsTable
        data={sessions}
        isLoading={updating}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SessionsEdit />
    </div>
  );
}
