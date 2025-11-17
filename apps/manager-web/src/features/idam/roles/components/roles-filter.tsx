"use client";

/**
 * @file roles-filter.tsx
 * @description Roles 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여
 * Roles 모듈의 검색 + 필터 조건을 구성합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface RolesFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<string, string[] | null>;
  onSearchFiltersChange: (filters: Record<string, string[] | null>) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
}

/**
 * Roles 검색 필터 항목 설정
 */
const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
    ],
  },
  {
    key: "category",
    label: "카테고리",
    options: [
      { value: "MANAGER_ADMIN", label: "매니저 관리자" },
      { value: "PLATFORM_SUPPORT", label: "플랫폼 지원" },
      { value: "TENANT_ADMIN", label: "테넌트 관리자" },
      { value: "TENANT_USER", label: "테넌트 사용자" },
    ],
  },
];

export function RolesFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: RolesFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="역할명, 코드 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
