"use client";

/**
 * API Keys List Page
 *
 * API 키 관리 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status → status 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useState } from "react";
import { toast } from "sonner";
import {
  ApiKeysHeader,
  ApiKeysStats,
  ApiKeysFilter,
  ApiKeysTable,
  ApiKeysEdit,
  useApiKeys,
  useDeleteApiKey,
  useUpdateApiKey,
  useApiKeyStore,
  type ApiKeysFilterState,
} from "@/features/idam/api-keys";
import type { ApiKey } from "@/features/idam/api-keys";

export default function ApiKeysPage() {
  // Store에서 UI 상태 가져오기
  const { currentPage, itemsPerPage, setSearchText, setSelectedStatus } =
    useApiKeyStore();

  // 로컬 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 확정)
  const [localFilters, setLocalFilters] = useState<ApiKeysFilterState>({
    status: null,
  });

  // 서버에 전달할 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<ApiKeysFilterState>({
    status: null,
  });

  const [searchText, setSearchTextLocal] = useState("");

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: apiKeysResponse,
    loading,
    refetch,
  } = useApiKeys({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: appliedFilters.status || undefined,
    search: searchText || undefined,
  });

  // GraphQL 뮤테이션 - 삭제, 수정
  const [deleteApiKey, { loading: deleting }] = useDeleteApiKey();
  const [updateApiKey, { loading: updating }] = useUpdateApiKey();

  // API 키 데이터
  const apiKeys = apiKeysResponse?.apiKeys || [];

  const handleSearchChange = (text: string) => {
    setSearchTextLocal(text);
    setSearchText(text);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setSelectedStatus(localFilters.status || null);
  };

  const handleEdit = (apiKey: ApiKey) => {
    const { openForm } = useApiKeyStore.getState();
    openForm(apiKey.id);
  };

  const handleDelete = async (apiKey: ApiKey) => {
    if (confirm(`API 키 "${apiKey.keyName}"를 삭제하시겠습니까?`)) {
      try {
        await deleteApiKey({
          variables: {
            id: apiKey.id,
          },
        });
        toast.success("API 키가 삭제되었습니다");
        refetch();
      } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        toast.error(`API 키 삭제 실패: ${message}`);
        console.error("Failed to delete API key:", error);
      }
    }
  };

  const handleToggleStatus = async (apiKey: ApiKey) => {
    const newStatus = apiKey.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "활성화" : "비활성화";

    if (confirm(`API 키 "${apiKey.keyName}"를 ${action}하시겠습니까?`)) {
      try {
        await updateApiKey({
          variables: {
            id: apiKey.id,
            input: {
              status: newStatus,
            },
          },
        });
        toast.success(`API 키가 ${action}되었습니다`);
        refetch();
      } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        toast.error(`API 키 ${action} 실패: ${message}`);
        console.error("Failed to update API key status:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6 p-6">
      <ApiKeysHeader onRefresh={() => refetch()} />
      <ApiKeysStats data={apiKeys} />

      {/* Jira 스타일 검색 + 필터 */}
      <ApiKeysFilter
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
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
