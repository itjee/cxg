"use client";

/**
 * @file login-logs-filter.tsx
 * @description Login Logs 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Login Logs 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface LoginLogsFilterProps {
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

export function LoginLogsFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApplySearch,
  onClearAllSearchFilters,
}: LoginLogsFilterProps) {
  // 필터 아이템 정의
  const filterItems: FilterItemConfig[] = [
    {
      key: "success",
      label: "결과",
      options: [
        { value: "true", label: "성공" },
        { value: "false", label: "실패" },
      ],
    },
    {
      key: "attemptType",
      label: "시도 타입",
      options: [
        { value: "LOGIN", label: "로그인" },
        { value: "LOGOUT", label: "로그아웃" },
        { value: "FAILED_LOGIN", label: "로그인 실패" },
        { value: "LOCKED", label: "계정 잠김" },
        { value: "PASSWORD_RESET", label: "비밀번호 재설정" },
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
      searchPlaceholder="사용자명, IP 주소 검색..."
      onClearAllSearchFilters={onClearAllSearchFilters}
    />
  );
}
