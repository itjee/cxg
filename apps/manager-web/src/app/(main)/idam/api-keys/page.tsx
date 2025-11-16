"use client";

/**
 * API Keys List Page
 *
 * API 키 관리 페이지
 * Apollo GraphQL Hooks를 사용합니다.
 */

import { toast } from "sonner";
import {
  ApiKeysHeader,
  ApiKeysStats,
  ApiKeysFilters,
  ApiKeysTable,
  ApiKeysEdit,
  useApiKeys,
  useDeleteApiKey,
  useUpdateApiKey,
  useApiKeyStore,
} from "@/features/idam/api-keys";
import type { ApiKey } from "@/features/idam/api-keys";

export default function ApiKeysPage() {
  // Store에서 UI 상태 가져오기
  const { selectedStatus, currentPage, itemsPerPage } =
    useApiKeyStore();

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: apiKeysResponse,
    loading,
    refetch,
  } = useApiKeys({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: selectedStatus || undefined,
  });

  // GraphQL 뮤테이션 - 삭제, 수정
  const [deleteApiKey, { loading: deleting }] = useDeleteApiKey();
  const [updateApiKey, { loading: updating }] = useUpdateApiKey();

  // API 키 데이터
  const apiKeys = apiKeysResponse?.apiKeys || [];

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
      <ApiKeysFilters />
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
