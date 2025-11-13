'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { usePartnerStore } from '../stores';
import type { Partner } from '../types';

interface PartnersFiltersProps {
  partners: Partner[];
}

/**
 * Partners 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 usePartnerStore와 연동
 */
export function PartnersFilters({ partners }: PartnersFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = usePartnerStore();

  // 고유한 유형 목록 생성
  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(partners.map((p) => p.type).filter(Boolean))
    ) as string[];
  }, [partners]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '거래처코드, 거래처명, 이메일...',
        type: 'search',
      },
      {
        key: 'selectedType',
        label: '유형',
        description: '전체 유형',
        type: 'select',
        options: uniqueTypes.map((type) => ({
          label: type,
          value: type,
        })),
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '활성', value: 'ACTIVE' },
          { label: '비활성', value: 'INACTIVE' },
          { label: '중지', value: 'SUSPENDED' },
          { label: '종료', value: 'CLOSED' },
        ],
      },
    ],
    [uniqueTypes]
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    selectedType,
    selectedStatus,
  };

  // 필터 변경 핸들러
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
