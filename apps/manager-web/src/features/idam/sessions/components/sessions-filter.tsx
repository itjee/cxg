"use client";

/**
 * @file sessions-filter.tsx
 * @description Sessions 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Sessions 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { SessionsFilterState } from "./sessions-filter-popup";

interface SessionsFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: SessionsFilterState;
  onFiltersChange: (filters: SessionsFilterState) => void;
  onApplyFilters: () => void;
}

const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "EXPIRED", label: "만료됨" },
      { value: "REVOKED", label: "취소됨" },
    ],
  },
  {
    key: "sessionType",
    label: "세션 타입",
    options: [
      { value: "WEB", label: "웹" },
      { value: "API", label: "API" },
      { value: "MOBILE", label: "모바일" },
    ],
  },
];

export function SessionsFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}: SessionsFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="세션 검색..."
    />
  );
}
