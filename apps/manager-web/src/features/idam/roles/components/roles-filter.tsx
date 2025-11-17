"use client";

/**
 * @file roles-filter.tsx
 * @description Roles 모듈 필터 컴포넌트
 *
 * 공통 QueryFilter 컴포넌트를 사용하여
 * Roles 모듈의 쿼리 + 필터 조건을 구성합니다.
 */

import { QueryFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface RolesFilterProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  queryFilters: Record<string, string[] | null>;
  onQueryFiltersChange: (filters: Record<string, string[] | null>) => void;
  onApplyQuery: () => void;
  onClearAllFilters?: () => void;
}

/**
 * Roles 쿼리 필터 항목 설정
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
  queryText,
  onQueryTextChange,
  queryFilters,
  onQueryFiltersChange,
  onApplyQuery,
  onClearAllFilters,
}: RolesFilterProps) {
  return (
    <QueryFilter
      queryText={queryText}
      onQueryTextChange={onQueryTextChange}
      queryFilters={queryFilters}
      onQueryFiltersChange={onQueryFiltersChange}
      onApply={onApplyQuery}
      filterItems={filterItems}
      queryPlaceholder="역할명, 코드 검색..."
      onClearAllFilters={onClearAllFilters}
    />
  );
}
