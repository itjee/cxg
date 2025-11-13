'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useOpportunityStore } from '../stores';
import type { Opportunity } from '../types';

interface OpportunitiesFiltersProps {
  opportunities: Opportunity[];
}

/**
 * Opportunities 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useOpportunityStore와 연동
 */
export function OpportunitiesFilters({ opportunities }: OpportunitiesFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStage,
    setSelectedStage,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useOpportunityStore();

  // 고유한 단계 목록 생성
  const uniqueStages = useMemo(() => {
    return Array.from(
      new Set(opportunities.map((o) => o.stage).filter(Boolean))
    ) as string[];
  }, [opportunities]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '영업기회명, 설명...',
        type: 'search',
      },
      {
        key: 'selectedStage',
        label: '단계',
        description: '전체 단계',
        type: 'select',
        options: uniqueStages.map((stage) => ({
          label: stage,
          value: stage,
        })),
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '활성', value: 'active' },
          { label: '비활성', value: 'inactive' },
        ],
      },
    ],
    [uniqueStages]
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    selectedStage,
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
        break;
      case 'selectedStage':
        setSelectedStage(value as string);
        break;
      case 'selectedStatus':
        setSelectedStatus(value as string);
        break;
    }
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
