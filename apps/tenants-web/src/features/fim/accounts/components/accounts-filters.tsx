'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useAccountsStore } from '../stores';

interface AccountsFiltersProps {
  data: any[];
}

export function AccountsFilters({ data }: AccountsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useAccountsStore();

  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '전체 검색...',
        type: 'search',
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '초안', value: 'DRAFT' },
          { label: '승인', value: 'APPROVED' },
          { label: '완료', value: 'COMPLETED' },
          { label: '취소', value: 'CANCELLED' },
        ],
      },
    ],
    []
  );

  const filterValues = {
    globalFilter,
    selectedType,
    selectedStatus,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
        break;
      case 'selectedType':
        setSelectedType(value as string);
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
