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
  type Session,
} from "@/features/idam/sessions";
import { useUsers } from "@/features/idam/users";

export default function SessionsPage() {
  // Store에서 UI 상태 가져오기
  const { currentPage, itemsPerPage, setSearchText, setCurrentPage } =
    useSessionsStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    username: null,
    sessionType: null,
    status: null,
  });

  const [searchTextLocal, setSearchTextLocal] = useState("");

  // 검색 텍스트 debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(searchTextLocal);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTextLocal, setSearchText]);

  // 사용자 목록 조회 (필터용)
  const { data: usersResponse } = useUsers({
    limit: 1000, // 필터용이므로 충분한 개수
    offset: 0,
    status: "ACTIVE", // 활성 사용자만
  });

  const usersList = usersResponse?.users || [];

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: sessionsResponse,
    loading,
    refetch,
  } = useSessions({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    userId: Array.isArray(searchFilters.username)
      ? searchFilters.username[0] // username 필터에서 첫 번째 선택 사용자의 ID
      : undefined,
    sessionType: Array.isArray(searchFilters.sessionType)
      ? (searchFilters.sessionType[0] as any)
      : undefined,
    status: Array.isArray(searchFilters.status)
      ? (searchFilters.status[0] as any)
      : undefined,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateSession, { loading: updating }] = useUpdateSession();

  // 세션 데이터
  const sessions = sessionsResponse?.sessions?.items || [];
  const totalSessions = sessionsResponse?.sessions?.total || 0;

  const handleSearchTextChange = (text: string) => {
    // 검색 텍스트는 현재 백엔드에서 지원하지 않아 저장만 함
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useSessions가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      username: null,
      sessionType: null,
      status: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleDelete = async (session: Session) => {
    if (confirm(`세션 '${session.userId}' 을(를) 삭제하시겠습니까?`)) {
      try {
        await updateSession({
          variables: {
            id: session.id,
            input: { status: "REVOKED" },
          },
        });
        toast.success("세션이 삭제되었습니다");
        refetch();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "알 수 없는 오류";
        toast.error(`세션 삭제 실패: ${message}`);
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
        searchText={searchTextLocal}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
        usersList={usersList}
      />

      <SessionsTable
        data={sessions}
        isLoading={updating}
        totalItems={totalSessions}
        onRevoke={(session) => console.log("Revoke:", session)}
        onDelete={handleDelete}
      />
      <SessionsEdit />
    </div>
  );
}
