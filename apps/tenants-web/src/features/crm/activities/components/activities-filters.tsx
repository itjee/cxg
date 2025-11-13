'use client';

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useActivityStore } from '../stores';
import type { Activity } from '../types';

interface ActivitiesFiltersProps {
  activities: Activity[];
}

/**
 * Activities 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useActivityStore와 연동
 */
export function ActivitiesFilters({ activities }: ActivitiesFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useActivityStore();

  // 고유한 유형 목록 생성
  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(activities.map((a) => a.activity_type).filter(Boolean))
    ) as string[];
  }, [activities]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '제목, 거래처명, 설명...',
        type: 'search',
      },
      {
        key: 'selectedType',
        label: '활동 유형',
        description: '전체 유형',
        type: 'select',
        options: [
          { label: '전화', value: 'CALL' },
          { label: '이메일', value: 'EMAIL' },
          { label: '미팅', value: 'MEETING' },
          { label: '메모', value: 'NOTE' },
          { label: '작업', value: 'TASK' },
          { label: '기타', value: 'OTHER' },
        ],
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '대기', value: 'PENDING' },
          { label: '완료', value: 'COMPLETED' },
          { label: '취소', value: 'CANCELLED' },
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
