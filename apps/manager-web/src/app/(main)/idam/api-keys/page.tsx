"use client";

/**
 * @file page.tsx
 * @description API Keys List Page
 *
 * Manager API Keys 목록 페이지
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
  ApiKeysHeader,
  ApiKeysStats,
  ApiKeysFilter,
  ApiKeysTable,
  ApiKeysEdit,
  useApiKeysStore,
  type ApiKey,
} from "@/features/idam/api-keys";

export default function ApiKeysPage() {
  // Store에서 UI 상태 가져오기
  const {
    setSearchText,
    setCurrentPage,
  } = useApiKeysStore();

  // 검색 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 GraphQL 쿼리 실행)
  const [searchFilters, setSearchFilters] = useState<
    Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  >({
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

  // TODO: 백엔드에서 apiKeys 쿼리가 구현되면 활성화
  // GraphQL 쿼리 - Apollo Hooks 사용
  // const {
  //   data: apiKeysResponse,
  //   loading,
  //   refetch,
  // } = useApiKeys({
  //   limit: itemsPerPage,
  //   offset: currentPage * itemsPerPage,
  //   status: Array.isArray(searchFilters.status) ? searchFilters.status[0] : undefined,
  //   search: searchTextLocal || undefined,
  // });

  // GraphQL 뮤테이션 - 삭제, 수정 (비활성화)
  // const [deleteApiKey, { loading: deleting }] = useDeleteApiKey();
  // const [updateApiKey, { loading: updating }] = useUpdateApiKey();

  // Mock 데이터 (백엔드 구현 대기 중)
  const loading = false;
  const refetch = () => {};
  const apiKeys: ApiKey[] = [];

  const handleSearchTextChange = (text: string) => {
    setSearchTextLocal(text);
  };

  const handleApplySearch = () => {
    // 필터 적용 시 필요한 추가 작업이 있으면 여기에 작성
    // 현재는 searchFilters 상태 업데이트로 useApiKeys가 자동으로 refetch됨
  };

  const handleClearAllSearchFilters = () => {
    // 모든 필터 초기화
    setSearchFilters({
      status: null,
    });
    // 검색 텍스트도 초기화
    setSearchText("");
    setSearchTextLocal("");
    // 페이지 번호 초기화 (첫 페이지로)
    setCurrentPage(0);
  };

  const handleEdit = (apiKey: ApiKey) => {
    const { openForm } = useApiKeysStore.getState();
    openForm(apiKey.id);
  };

  const handleDelete = () => {
    toast.info("백엔드 구현 대기 중입니다");
  };

  const handleToggleStatus = () => {
    toast.info("백엔드 구현 대기 중입니다");
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <ApiKeysHeader onRefresh={() => refetch()} />
      <ApiKeysStats data={apiKeys} />

      {/* Jira 스타일 검색 + 필터 팝업 */}
      <ApiKeysFilter
        searchText={searchTextLocal}
        onSearchTextChange={handleSearchTextChange}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
        onApplySearch={handleApplySearch}
        onClearAllSearchFilters={handleClearAllSearchFilters}
      />

      <ApiKeysTable
        data={apiKeys}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
      <ApiKeysEdit />
    </div>
  );
}
