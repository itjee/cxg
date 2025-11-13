'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useFixedAssetsStore } from '../stores';

interface FixedAssetsFiltersProps {
  data: any[];
}

export function FixedAssetsFilters({ data }: FixedAssetsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useFixedAssetsStore();

  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '자산명, 코드, 위치...',
        type: 'search',
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '운용중', value: 'ACTIVE' },
          { label: '폐기', value: 'DISPOSED' },
          { label: '수리중', value: 'MAINTENANCE' },
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
