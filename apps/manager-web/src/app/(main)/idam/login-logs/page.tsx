"use client";

/**
 * @file page.tsx
 * @description 로그인 이력 페이지
 *
 * Manager Login Logs 목록 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - success → success 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - attemptType → attempt_type 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState } from "react";
import { toast } from "sonner";
import {
  LoginLogsHeader,
  LoginLogsStats,
  LoginLogsFilter,
  LoginLogsTable,
  LoginLogsEdit,
  useLoginLogs,
  useDeleteLoginLog,
  useLoginLogsStore,
  type LoginLog,
} from "@/features/idam/login-logs";

export default function LoginLogsPage() {
  // Store에서 UI 상태 가져오기
  const {
    searchText,
    currentPage,
    itemsPerPage,
    setSearchText,
    setCurrentPage,
  } = useLoginLogsStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
    success: null,
    attemptType: null,
  });

  // GraphQL 쿼리 변수 생성
  const queryVariables = {
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    search: searchText || undefined,
    success: Array.isArray(searchFilters.success)
      ? searchFilters.success[0] === "true"
      : undefined,
    attemptType: Array.isArray(searchFilters.attemptType)
      ? (searchFilters.attemptType[0] as any)
      : undefined,
  };

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: logsResponse,
    loading,
    refetch,
  } = useLoginLogs(queryVariables);

  // GraphQL 뮤테이션 - 삭제
  const [deleteLoginLog] = useDeleteLoginLog();

  // 로그인 이력 데이터 및 전체 개수
  const connection = logsResponse?.loginLogsConnection;
  const logs = connection?.items || [];
  const totalCount = connection?.total || 0;

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useLoginLogs가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      success: null,
      attemptType: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  // 로그인 이력 삭제 핸들러
  const handleDelete = async (log: LoginLog) => {
    if (
      window.confirm(
        `로그인 이력을 삭제하시겠습니까?\n\n사용자: ${log.username || "N/A"}\nIP: ${log.ipAddress}`
      )
    ) {
      try {
        await deleteLoginLog({
          variables: {
            id: log.id,
          },
        });
        toast.success("로그인 이력이 삭제되었습니다");
        refetch();
      } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        toast.error(`로그인 이력 삭제 실패: ${message}`);
        console.error("Failed to delete login log:", error);
      }
    }
  };

  // 상세 보기 핸들러
  const handleViewDetail = (log: LoginLog) => {
    const { openForm } = useLoginLogsStore.getState();
    openForm(log.id);
  };

  // 내보내기 핸들러
  const handleExport = () => {
    toast.info("내보내기 기능은 준비 중입니다");
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <LoginLogsHeader onRefresh={() => refetch()} onExport={handleExport} />
      <LoginLogsStats data={logs} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <LoginLogsFilter
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <LoginLogsTable
        data={logs}
        totalItems={totalCount}
        isLoading={loading}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />

      <LoginLogsEdit />
    </div>
  );
}
