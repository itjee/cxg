'use client';

/**
 * @file tenants-filters.tsx
 * @description 테넌트 검색/필터 UI 컴포넌트
 *
 * 역할:
 * - 검색 입력 (코드, 이름, 상호명)
 * - 필터 옵션 (상태, 타입, 일시중단)
 * - Zustand 스토어 연동
 */

import { useMemo } from 'react';
import { QueryFilters, type FilterConfig } from '@/components/filters';
import { useTenantsStore } from '../stores/tenants.store';
import type { Tenant } from '../types';

interface TenantsFiltersProps {
  data: Tenant[];
}

export function TenantsFilters({ data }: TenantsFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    selectedIsSuspended,
    setSelectedIsSuspended,
    resetFilters,
  } = useTenantsStore();

  // 고유 상태 및 타입 추출
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(data.map((t) => t.status)));
  }, [data]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(data.map((t) => t.type)));
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: 'searchText',
      label: '검색',
      description: '코드, 이름, 상호명으로 검색',
      type: 'search',
    },
    {
      key: 'selectedStatus',
      label: '상태',
      description: '전체 상태',
      type: 'select',
      options: [
        { label: '평가판', value: 'TRIAL' },
        { label: '활성', value: 'ACTIVE' },
        { label: '일시중단', value: 'SUSPENDED' },
        { label: '종료', value: 'TERMINATED' },
      ],
    },
    {
      key: 'selectedType',
      label: '유형',
      description: '전체 유형',
      type: 'select',
      options: [
        { label: '평가판', value: 'TRIAL' },
        { label: '표준', value: 'STANDARD' },
        { label: '프리미엄', value: 'PREMIUM' },
        { label: '엔터프라이즈', value: 'ENTERPRISE' },
      ],
    },
    {
      key: 'selectedIsSuspended',
      label: '일시중단',
      description: '전체',
      type: 'select',
      options: [
        { label: '중단됨', value: 'true' },
        { label: '정상', value: 'false' },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedStatus,
    selectedType,
    selectedIsSuspended,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    // Handle both string and string[] cases (for multi-select support)
    const stringValue = Array.isArray(value) ? value[0] : value;
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedStatus: (val) => setSelectedStatus(val as any),
      selectedType: (val) => setSelectedType(val as any),
      selectedIsSuspended: setSelectedIsSuspended,
    };
    handlers[key]?.(stringValue);
  };

  return (
    <QueryFilters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
