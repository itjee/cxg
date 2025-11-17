"use client";

/**
 * @file users-filter.tsx
 * @description Users 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여
 * Users 모듈의 검색 + 필터 조건을 구성합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface UsersFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<string, string[] | null>;
  onSearchFiltersChange: (filters: Record<string, string[] | null>) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
}

/**
 * Users 검색 필터 항목 설정
 */
const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
      { value: "LOCKED", label: "잠금" },
    ],
  },
  {
    key: "userType",
    label: "사용자 유형",
    options: [
      { value: "ADMIN", label: "관리자" },
      { value: "USER", label: "사용자" },
    ],
  },
];

export function UsersFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: UsersFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="사용자명, 이메일, 아이디 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
