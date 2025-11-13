'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useRfqsStore } from '../stores';

interface RfqsFiltersProps {
  data: any[];
}

export function RfqsFilters({ data }: RfqsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useRfqsStore();

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
          { label: '활성', value: 'active' },
          { label: '비활성', value: 'inactive' },
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
