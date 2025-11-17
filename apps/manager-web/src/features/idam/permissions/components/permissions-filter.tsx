"use client";

/**
 * @file permissions-filter.tsx
 * @description Permissions 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Permissions 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { PermissionsFilterState } from "./permissions-filter-popup";

interface PermissionsFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: PermissionsFilterState;
  onFiltersChange: (filters: PermissionsFilterState) => void;
  onApplyFilters: () => void;
}

const filterItems: FilterItemConfig[] = [
  {
    key: "isActive",
    label: "활성 상태",
    options: [
      { value: "true", label: "활성" },
      { value: "false", label: "비활성" },
    ],
  },
];

export function PermissionsFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}: PermissionsFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="권한명 검색..."
    />
  );
}
