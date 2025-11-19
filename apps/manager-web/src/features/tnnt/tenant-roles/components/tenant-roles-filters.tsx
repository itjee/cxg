/**
 * @file tenant-roles-filters.tsx
 * @description 테넌트 역할 검색/필터 UI
 */

'use client';

import { useMemo } from 'react';
import { SearchFilterPopup, type FilterConfig } from '@/components/filters';
import { useTenantRolesStore } from '../stores';
import type { TenantRole } from '../types';

/**
 * 필터 값 타입
 */
type FilterValue = string[] | null | { type: string; value: { from?: string; to?: string } };

interface TenantRolesFiltersProps {
  data: TenantRole[];
}

export function TenantRolesFilters({ data }: TenantRolesFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedStatus,
    setSelectedStatus,
    selectedTenantId,
    setSelectedTenantId,
    showSystemRoles,
    setShowSystemRoles,
    resetFilters,
  } = useTenantRolesStore();

  const uniqueTenantIds = useMemo(() => {
    return Array.from(new Set(data.map((role) => role.tenant_id))).sort();
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: 'searchText',
      label: '검색',
      description: '역할명, 역할 코드...',
      type: 'search',
    },
    {
      key: 'selectedStatus',
      label: '상태',
      description: '전체 상태',
      type: 'select',
      options: [
        { label: '활성', value: 'ACTIVE' },
        { label: '비활성', value: 'INACTIVE' },
      ],
    },
    {
      key: 'selectedTenantId',
      label: '테넌트',
      description: '전체 테넌트',
      type: 'select',
      options: uniqueTenantIds.map((id) => ({ label: id, value: id })),
    },
    {
      key: 'showSystemRoles',
      label: '시스템 역할',
      description: '시스템 역할 표시',
      type: 'checkbox',
    },
  ];

  const filterValues = {
    searchText,
    selectedStatus,
    selectedTenantId,
    showSystemRoles: showSystemRoles ? 'true' : '',
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: any) => void> = {
      searchText: setSearchText,
      selectedStatus: setSelectedStatus as (val: string) => void,
      selectedTenantId: setSelectedTenantId,
      showSystemRoles: (val: string) => setShowSystemRoles(val === 'true'),
    };
    handlers[key]?.(value);
  };

  return (
    <SearchFilterPopup
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
