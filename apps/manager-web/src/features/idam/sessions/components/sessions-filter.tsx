"use client";

/**
 * @file sessions-filter.tsx
 * @description Sessions 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Sessions 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";
import type { User } from "@/features/idam/users";

interface SessionsFilterProps {
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
  usersList?: User[];
}

export function SessionsFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
  usersList = [],
}: SessionsFilterProps) {
  // 필터 아이템 동적 생성 (사용자 목록 포함)
  const filterItems: FilterItemConfig[] = [
    {
      key: "username",
      label: "사용자명",
      options: usersList.map((user) => ({
        value: user.id,
        label: user.username,
      })),
    },
    {
      key: "sessionType",
      label: "세션 타입",
      options: [
        { value: "WEB", label: "웹" },
        { value: "API", label: "API" },
        { value: "MOBILE", label: "모바일" },
      ],
    },
    {
      key: "status",
      label: "상태",
      options: [
        { value: "ACTIVE", label: "활성" },
        { value: "EXPIRED", label: "만료됨" },
        { value: "REVOKED", label: "취소됨" },
      ],
    },
  ];

  return (
    <SearchFilter
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchFilters={searchFilters}
      onSearchFiltersChange={onSearchFiltersChange}
      onApply={onApplySearch}
      filterItems={filterItems}
      searchPlaceholder="세션 ID 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
