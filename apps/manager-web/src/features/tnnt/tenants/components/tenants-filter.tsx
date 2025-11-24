"use client";

/**
 * @file tenants-filter.tsx
 * @description Tenants 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여
 * Tenants 모듈의 검색 + 필터 조건을 구성합니다.
 * 필터: 상태, 테넌트 유형, 일시중단 상태
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface TenantsFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>;
  onSearchFiltersChange: (
    filters: Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>
  ) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
}

/**
 * Tenants 검색 필터 항목 설정
 *
 * 필터 종류:
 * - checkbox: 다중 선택 (status, type, is_suspended)
 */
const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "테넌트 상태",
    type: "checkbox",
    options: [
      { value: "TRIAL", label: "평가판" },
      { value: "ACTIVE", label: "활성" },
      { value: "SUSPENDED", label: "일시중단" },
      { value: "TERMINATED", label: "종료" },
    ],
  },
  {
    key: "type",
    label: "테넌트 유형",
    type: "checkbox",
    options: [
      { value: "TRIAL", label: "평가판" },
      { value: "STANDARD", label: "표준" },
      { value: "PREMIUM", label: "프리미엄" },
      { value: "ENTERPRISE", label: "엔터프라이즈" },
    ],
  },
  {
    key: "is_suspended",
    label: "일시중단 여부",
    type: "checkbox",
    options: [
      { value: "true", label: "중단됨" },
      { value: "false", label: "정상" },
    ],
  },
];

export function TenantsFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: TenantsFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="테넌트 코드, 이름, 상호명 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
