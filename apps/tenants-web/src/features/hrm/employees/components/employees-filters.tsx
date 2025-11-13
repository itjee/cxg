'use client';

import { useMemo } from 'react';
import { Filters } from '@/components/filters/filters';
import type { FilterConfig } from '@/components/filters/filters';
import { useEmployeeStore } from '../stores/employee.store';

interface EmployeesFiltersProps {
  employees: any[];
}

export function EmployeesFilters({ employees }: EmployeesFiltersProps) {
  const { globalFilter, setGlobalFilter, selectedStatus, setSelectedStatus, resetFilters } =
    useEmployeeStore();

  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '사원명, 사번, 이메일로 검색',
        type: 'search',
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '재직', value: 'active' },
          { label: '휴직', value: 'leave' },
          { label: '퇴사', value: 'retired' },
        ],
      },
    ],
    []
  );

  const filterValues = {
    globalFilter,
    selectedStatus,
  };

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
