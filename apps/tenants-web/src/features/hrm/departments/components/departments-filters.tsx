'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useDepartmentsStore } from '../stores';
import type { Department } from '../types';

interface DepartmentsFiltersProps {
  departments: Department[];
}

/**
 * Departments 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useDepartmentsStore와 연동
 */
export function DepartmentsFilters({ departments }: DepartmentsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    parentFilter,
    setParentFilter,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useDepartmentsStore();

  // 상위 부서 목록 생성
  const parentDepartments = useMemo(() => {
    return departments.filter((d) => !d.parent_id);
  }, [departments]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '부서명, 코드...',
        type: 'search',
      },
      {
        key: 'parentFilter',
        label: '상위 부서',
        description: '전체 부서',
        type: 'select',
        options: parentDepartments.map((dept) => ({
          label: dept.name,
          value: dept.id,
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
    [parentDepartments]
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    parentFilter,
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
        break;
      case 'parentFilter':
        setParentFilter(value as string);
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
