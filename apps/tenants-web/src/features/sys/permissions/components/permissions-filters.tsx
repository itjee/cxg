'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { usePermissionStore } from '../stores';
import type { Permission } from '../types';

interface PermissionsFiltersProps {
  permissions: Permission[];
}

/**
 * Permissions 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 usePermissionStore와 연동
 */
export function PermissionsFilters({ permissions }: PermissionsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedModule,
    setSelectedModule,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = usePermissionStore();

  // 고유한 모듈 목록 생성
  const uniqueModules = useMemo(() => {
    return Array.from(
      new Set(permissions.map((p) => p.module).filter(Boolean))
    ) as string[];
  }, [permissions]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '권한명, 설명...',
        type: 'search',
      },
      {
        key: 'selectedModule',
        label: '모듈',
        description: '전체 모듈',
        type: 'select',
        options: uniqueModules.map((module) => ({
          label: module,
          value: module,
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
    [uniqueModules]
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    selectedModule,
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
        break;
      case 'selectedModule':
        setSelectedModule(value as string);
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
