'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useCodeRuleStore } from '../stores';
import type { CodeRule } from '../types';

interface CodeRulesFiltersProps {
  codeRules: CodeRule[];
}

/**
 * CodeRules 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useCodeRuleStore와 연동
 */
export function CodeRulesFilters({ codeRules }: CodeRulesFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useCodeRuleStore();

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '엔티티명, 엔티티 코드, 프리픽스...',
        type: 'search',
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
    []
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
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
