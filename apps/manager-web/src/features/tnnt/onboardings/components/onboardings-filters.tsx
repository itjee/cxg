/**
 * @file onboardings-filters.tsx
 * @description 온보딩 프로세스 검색/필터 UI
 */

'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useOnboardingsStore } from '../stores';
import type { Onboarding } from '../types';

interface OnboardingsFiltersProps {
  data: Onboarding[];
}

export function OnboardingsFilters({ data }: OnboardingsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStepName,
    setSelectedStepName,
    selectedStepStatus,
    setSelectedStepStatus,
    selectedTenantId,
    setSelectedTenantId,
    resetFilters,
  } = useOnboardingsStore();

  const uniqueTenantIds = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.tenant_id))).sort();
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: 'globalFilter',
      label: '검색',
      description: '테넌트 ID, 단계명...',
      type: 'search',
    },
    {
      key: 'selectedStepName',
      label: '단계',
      description: '전체 단계',
      type: 'select',
      options: [
        { label: '등록', value: 'REGISTRATION' },
        { label: '이메일 인증', value: 'EMAIL_VERIFICATION' },
        { label: '스키마 생성', value: 'SCHEMA_CREATION' },
        { label: '초기 설정', value: 'INITIAL_SETUP' },
        { label: '데이터 마이그레이션', value: 'DATA_MIGRATION' },
        { label: '환경 설정', value: 'CONFIGURATION' },
        { label: '완료', value: 'COMPLETED' },
      ],
    },
    {
      key: 'selectedStepStatus',
      label: '상태',
      description: '전체 상태',
      type: 'select',
      options: [
        { label: '대기', value: 'PENDING' },
        { label: '진행 중', value: 'IN_PROGRESS' },
        { label: '완료', value: 'COMPLETED' },
        { label: '실패', value: 'FAILED' },
        { label: '건너뜀', value: 'SKIPPED' },
      ],
    },
    {
      key: 'selectedTenantId',
      label: '테넌트',
      description: '전체 테넌트',
      type: 'select',
      options: uniqueTenantIds.map((id) => ({ label: id, value: id })),
    },
  ];

  const filterValues = {
    globalFilter,
    selectedStepName,
    selectedStepStatus,
    selectedTenantId,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      globalFilter: setGlobalFilter,
      selectedStepName: setSelectedStepName as (val: string) => void,
      selectedStepStatus: setSelectedStepStatus as (val: string) => void,
      selectedTenantId: setSelectedTenantId,
    };
    handlers[key]?.(value);
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
