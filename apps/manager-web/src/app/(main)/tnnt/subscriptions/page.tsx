/**
 * @file page.tsx
 * @description 구독 관리 메인 페이지
 *
 * 컴포넌트 조합을 통한 목록 페이지 구현
 * - Header (제목, 버튼)
 * - Stats (통계 카드)
 * - Filters (검색/필터)
 * - Table (데이터 테이블)
 * - Edit Modal (수정 모달)
 */

'use client';

import { toast } from 'sonner';
import {
  SubscriptionsHeader,
  SubscriptionsStats,
  SubscriptionsFilters,
  SubscriptionsTable,
  SubscriptionsEdit,
} from '@/features/tnnt/subscriptions';
import {
  useSubscriptions,
  useDeleteSubscription,
} from '@/features/tnnt/subscriptions/hooks';
import { useSubscriptionsStore } from '@/features/tnnt/subscriptions/stores/subscriptions.store';
import type { Subscription } from '@/features/tnnt/subscriptions/types/subscriptions.types';

export default function SubscriptionsPage() {
  const {
    globalFilter,
    selectedStatus,
    selectedBillingCycle,
    currentPage,
    itemsPerPage,
    openForm,
  } = useSubscriptionsStore();

  // 목록 조회
  const {
    data: subscriptionsResponse,
    isLoading,
    error,
    refetch,
  } = useSubscriptions({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    status: selectedStatus || undefined,
    billing_cycle: selectedBillingCycle || undefined,
  });

  const deleteMutation = useDeleteSubscription({
    onSuccess: () => {
      toast.success('구독이 삭제되었습니다');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || '삭제 실패');
    },
  });

  const subscriptions = subscriptionsResponse?.data || [];

  // 수정 핸들러
  const handleEdit = (subscription: Subscription) => {
    openForm(subscription.id);
  };

  // 삭제 핸들러
  const handleDelete = (subscription: Subscription) => {
    if (
      window.confirm(
        `구독을 삭제하시겠습니까?\n\n테넌트: ${subscription.tenant_id.slice(0, 8)}...\n플랜: ${subscription.plan_id.slice(0, 8)}...`
      )
    ) {
      deleteMutation.mutate(subscription.id);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">에러: {(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="text-primary hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubscriptionsHeader onRefresh={() => refetch()} />
      <SubscriptionsStats data={subscriptions} />
      <SubscriptionsFilters data={subscriptions} />
      <SubscriptionsTable
        data={subscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SubscriptionsEdit />
    </div>
  );
}
