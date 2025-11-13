/**
 * @file page.tsx
 * @description API 키 관리 페이지
 */

'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  ApiKeysHeader,
  ApiKeysStats,
  ApiKeysFilters,
  ApiKeysTable,
  ApiKeysEdit,
  useApiKeys,
  useDeleteApiKey,
  useUpdateApiKeyStatus,
  useApiKeyStore,
} from '@/features/idam/api_keys';
import type { ApiKey } from '@/features/idam/api_keys';

export default function ApiKeysPage() {
  const {
    globalFilter,
    selectedStatus,
    currentPage,
    itemsPerPage,
    openForm,
  } = useApiKeyStore();

  const {
    data: apiKeysResponse,
    isLoading,
    error,
    refetch,
  } = useApiKeys({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    status: selectedStatus ? (selectedStatus as any) : undefined,
  });

  const deleteMutation = useDeleteApiKey();
  const statusMutation = useUpdateApiKeyStatus();

  const apiKeys = apiKeysResponse?.data || [];

  // 통계 계산
  const stats = useMemo(() => {
    const total = apiKeys.length;
    const active = apiKeys.filter(key => key.status === 'ACTIVE').length;
    const inactive = apiKeys.filter(key => key.status === 'INACTIVE').length;
    const revoked = apiKeys.filter(key => key.status === 'REVOKED').length;
    const totalUsage = apiKeys.reduce((sum, key) => sum + key.usage_count, 0);

    return { total, active, inactive, revoked, totalUsage };
  }, [apiKeys]);

  const handleEdit = (apiKey: ApiKey) => {
    openForm(apiKey.id);
  };

  const handleDelete = (apiKey: ApiKey) => {
    if (confirm(`API 키 "${apiKey.key_name}"를 삭제하시겠습니까?\n키 ID: ${apiKey.key_id}`)) {
      deleteMutation.mutate(apiKey.id, {
        onSuccess: () => {
          toast.success('API 키가 삭제되었습니다');
        },
        onError: (error) => {
          toast.error(error.message || 'API 키 삭제에 실패했습니다');
        },
      });
    }
  };

  const handleToggleStatus = (apiKey: ApiKey) => {
    const newStatus = apiKey.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? '활성화' : '비활성화';
    
    if (confirm(`API 키 "${apiKey.key_name}"를 ${action}하시겠습니까?`)) {
      statusMutation.mutate(
        { id: apiKey.id, status: newStatus },
        {
          onSuccess: () => {
            toast.success(`API 키가 ${action}되었습니다`);
          },
          onError: (error) => {
            toast.error(error.message || `API 키 ${action}에 실패했습니다`);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">에러: {error.message}</p>
          <button onClick={() => refetch()} className="text-primary hover:underline">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ApiKeysHeader onRefresh={() => refetch()} />
      <ApiKeysStats {...stats} />
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
