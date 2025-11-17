"use client";

/**
 * @file users-filter.tsx
 * @description Users 모듈 필터 컴포넌트
 *
 * 공통 QueryFilter 컴포넌트를 사용하여
 * Users 모듈의 쿼리 + 필터 조건을 구성합니다.
 */

import { QueryFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface UsersFilterProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  queryFilters: Record<string, string[] | null>;
  onQueryFiltersChange: (filters: Record<string, string[] | null>) => void;
  onApplyQuery: () => void;
}

/**
 * Users 쿼리 필터 항목 설정
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
  queryText,
  onQueryTextChange,
  queryFilters,
  onQueryFiltersChange,
  onApplyQuery,
}: UsersFilterProps) {
  return (
    <QueryFilter
      queryText={queryText}
      onQueryTextChange={onQueryTextChange}
      queryFilters={queryFilters}
      onQueryFiltersChange={onQueryFiltersChange}
      onApply={onApplyQuery}
      filterItems={filterItems}
      queryPlaceholder="사용자명, 이메일, 아이디 검색..."
    />
  );
}
