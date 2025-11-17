/**
 * @file page.tsx
 * @description 온보딩 프로세스 관리 페이지
 */

'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  OnboardingsHeader,
  OnboardingsStats,
  OnboardingsFilters,
  OnboardingsTable,
  OnboardingsEdit,
} from '@/features/tnnt/onboardings';
import {
  useOnboardings,
  useRetryOnboarding,
} from '@/features/tnnt/onboardings/hooks';
import { useOnboardingsStore } from '@/features/tnnt/onboardings/stores';
import type { Onboarding } from '@/features/tnnt/onboardings/types';

export default function OnboardingsPage() {
  const {
    searchText,
    selectedStepName,
    selectedStepStatus,
    selectedTenantId,
    currentPage,
    itemsPerPage,
    openForm,
  } = useOnboardingsStore();

  // 서버 사이드 페이징 조회
  const {
    data: onboardingsResponse,
    isLoading,
    error,
    refetch,
  } = useOnboardings({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    step_name: selectedStepName || undefined,
    step_status: selectedStepStatus || undefined,
    tenant_id: selectedTenantId || undefined,
  });

  // 재시도 mutation
  const retryMutation = useRetryOnboarding();

  const onboardings = onboardingsResponse?.data || [];
  const totalItems = onboardingsResponse?.total || 0;

  // 상세 보기 핸들러
  const handleViewDetails = (onboarding: Onboarding) => {
    openForm(onboarding.id);
  };

  // 재시도 핸들러
  const handleRetry = (onboarding: Onboarding) => {
    if (
      window.confirm(
        `온보딩 단계를 재시도하시겠습니까?\n\n테넌트: ${onboarding.tenant_id}\n단계: ${onboarding.step_name}`
      )
    ) {
      retryMutation.mutate(onboarding.id, {
        onSuccess: () => {
          toast.success('온보딩 단계 재시도가 시작되었습니다');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || '재시도 실패');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">에러: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingsHeader onRefresh={() => refetch()} />
      <OnboardingsStats data={onboardings} />
      <OnboardingsFilters data={onboardings} />
      <OnboardingsTable
        data={onboardings}
        onViewDetails={handleViewDetails}
        onRetry={handleRetry}
      />
      <OnboardingsEdit />
    </div>
  );
}
