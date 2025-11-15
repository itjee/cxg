/**
 * @file onboardings-table.tsx
 * @description 온보딩 프로세스 데이터 테이블
 */

'use client';

import { DataTable } from '@/components/data-table';
import { useOnboardingsStore } from '../stores';
import { getOnboardingsColumns } from './onboardings-columns';
import type { Onboarding } from '../types';

interface OnboardingsTableProps {
  data: Onboarding[];
  onViewDetails?: (onboarding: Onboarding) => void;
  onRetry?: (onboarding: Onboarding) => void;
}

export function OnboardingsTable({
  data,
  onViewDetails,
  onRetry,
}: OnboardingsTableProps) {
  const { sorting, setSorting } = useOnboardingsStore();
  const columns = getOnboardingsColumns({ onViewDetails, onRetry });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="tenant_id"
      searchPlaceholder="테넌트 ID 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
