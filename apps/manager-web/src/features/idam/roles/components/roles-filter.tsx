"use client";

/**
 * @file roles-filter.tsx
 * @description Roles 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Roles 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { RolesFilterState } from "./roles-filter-popup";

interface RolesFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: RolesFilterState;
  onFiltersChange: (filters: RolesFilterState) => void;
  onApplyFilters: () => void;
}

const filterItems: FilterItemConfig[] = [
  {
    key: "isActive",
    label: "활성 상태",
    options: [
      { value: "active", label: "활성" },
      { value: "inactive", label: "비활성" },
    ],
  },
];

export function RolesFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}: RolesFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="역할명 검색..."
    />
  );
}
