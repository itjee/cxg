/**
 * @file tenant-users-filters.tsx
 * @description 테넌트 사용자 검색/필터 UI
 */

'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useTenantUsersStore } from '../stores';
import type { TenantUser } from '../types';

interface TenantUsersFiltersProps {
  data: TenantUser[];
}

export function TenantUsersFilters({ data }: TenantUsersFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStatus,
    setSelectedStatus,
    selectedTenantId,
    setSelectedTenantId,
    selectedRoleId,
    setSelectedRoleId,
    showPrimaryOnly,
    setShowPrimaryOnly,
    resetFilters,
  } = useTenantUsersStore();

  const uniqueTenantIds = useMemo(() => {
    return Array.from(new Set(data.map((user) => user.tenant_id))).sort();
  }, [data]);

  const uniqueRoles = useMemo(() => {
    return Array.from(
      new Set(
        data
          .filter((user) => user.role_name)
          .map((user) => ({ id: user.role_id!, name: user.role_name! }))
      )
    );
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: 'globalFilter',
      label: '검색',
      description: '사용자명, 이메일, 이름...',
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
        { label: '대기', value: 'PENDING' },
        { label: '정지', value: 'SUSPENDED' },
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
      key: 'selectedRoleId',
      label: '역할',
      description: '전체 역할',
      type: 'select',
      options: uniqueRoles.map((role) => ({ label: role.name, value: role.id })),
    },
    {
      key: 'showPrimaryOnly',
      label: '주 사용자만',
      description: '주 사용자만 표시',
      type: 'checkbox',
    },
  ];

  const filterValues = {
    globalFilter,
    selectedStatus,
    selectedTenantId,
    selectedRoleId,
    showPrimaryOnly: showPrimaryOnly ? 'true' : '',
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: any) => void> = {
      globalFilter: setGlobalFilter,
      selectedStatus: setSelectedStatus as (val: string) => void,
      selectedTenantId: setSelectedTenantId,
      selectedRoleId: setSelectedRoleId,
      showPrimaryOnly: (val: string) => setShowPrimaryOnly(val === 'true'),
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
