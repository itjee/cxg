'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useCurrencyStore } from '../stores';
import type { Currency } from '../types';

interface CurrenciesFiltersProps {
  currencies: Currency[];
}

/**
 * Currencies 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useCurrencyStore와 연동
 */
export function CurrenciesFilters({ currencies }: CurrenciesFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedDecimal,
    setSelectedDecimal,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useCurrencyStore();

  // 고유한 소수점 자릿수 목록 생성
  const uniqueDecimals = useMemo(() => {
    return Array.from(
      new Set(currencies.map((c) => c.decimal_places).filter((d) => d !== undefined))
    ).sort((a, b) => a - b);
  }, [currencies]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '코드, 이름, 기호...',
        type: 'search',
      },
      {
        key: 'selectedDecimal',
        label: '소수점',
        description: '전체',
        type: 'select',
        options: uniqueDecimals.map((decimal) => ({
          label: `${decimal}자리`,
          value: String(decimal),
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
    [uniqueDecimals]
  );

  // 필터 값 객체
  const filterValues = {
    globalFilter,
    selectedDecimal: selectedDecimal !== null ? String(selectedDecimal) : '',
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case 'globalFilter':
        setGlobalFilter(value as string);
        break;
      case 'selectedDecimal':
        setSelectedDecimal(value ? Number(value) : null);
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
