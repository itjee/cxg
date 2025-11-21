"use client";

/**
 * @file permissions-filter.tsx
 * @description Permissions 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Permissions 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

type FilterValue =
  | string[]
  | null
  | { type: string; value: { from?: string; to?: string } };

interface PermissionsFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<string, FilterValue>;
  onSearchFiltersChange: (filters: Record<string, FilterValue>) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
}

const filterItems: FilterItemConfig[] = [
  {
    key: "category",
    label: "카테고리",
    options: [
      { value: "USER_MANAGEMENT", label: "사용자 관리" },
      { value: "ROLE_MANAGEMENT", label: "역할 관리" },
      { value: "PERMISSION_MANAGEMENT", label: "권한 관리" },
      { value: "SYSTEM_SETTINGS", label: "시스템 설정" },
      { value: "TENANT_MANAGEMENT", label: "테넌트 관리" },
    ],
  },
  {
    key: "resource",
    label: "리소스",
    options: [
      { value: "users", label: "사용자" },
      { value: "roles", label: "역할" },
      { value: "permissions", label: "권한" },
      { value: "tenants", label: "테넌트" },
      { value: "system", label: "시스템" },
    ],
  },
  {
    key: "action",
    label: "작업",
    options: [
      { value: "CREATE", label: "생성 (CREATE)" },
      { value: "READ", label: "조회 (READ)" },
      { value: "UPDATE", label: "수정 (UPDATE)" },
      { value: "DELETE", label: "삭제 (DELETE)" },
      { value: "LIST", label: "목록 (LIST)" },
      { value: "MANAGE", label: "관리 (MANAGE)" },
    ],
  },
  {
    key: "scope",
    label: "범위",
    options: [
      { value: "GLOBAL", label: "전체 (GLOBAL)" },
      { value: "TENANT", label: "테넌트 (TENANT)" },
    ],
  },
  {
    key: "appliesTo",
    label: "적용대상",
    options: [
      { value: "ALL", label: "모두" },
      { value: "MASTER", label: "마스터" },
      { value: "TENANT", label: "테넌트" },
      { value: "SYSTEM", label: "시스템" },
    ],
  },
  {
    key: "isSystem",
    label: "시스템 권한",
    options: [
      { value: "true", label: "시스템 권한" },
      { value: "false", label: "사용자 정의 권한" },
    ],
  },
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
    ],
  },
];

export function PermissionsFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: PermissionsFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="권한명, 코드 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
