"use client";

/**
 * @file api-keys-filter.tsx
 * @description API Keys 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 API Keys 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { ApiKeysFilterState } from "./api-keys-filter-popup";

interface ApiKeysFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: ApiKeysFilterState;
  onFiltersChange: (filters: ApiKeysFilterState) => void;
  onApplyFilters: () => void;
}

const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
      { value: "REVOKED", label: "취소됨" },
    ],
  },
];

export function ApiKeysFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}: ApiKeysFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="API 키 검색..."
    />
  );
}
