"use client";

/**
 * @file api-keys-filter.tsx
 * @description API Keys 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 API Keys 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface ApiKeysFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<
    string,
    string[] | null | { type: string; value: { from?: string; to?: string } }
  >;
  onSearchFiltersChange: (
    filters: Record<
      string,
      string[] | null | { type: string; value: { from?: string; to?: string } }
    >
  ) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
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
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: ApiKeysFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="API 키 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
