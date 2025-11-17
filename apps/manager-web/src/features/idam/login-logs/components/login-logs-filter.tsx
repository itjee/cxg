"use client";

/**
 * @file login-logs-filter.tsx
 * @description Login Logs 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여 Login Logs 모듈의 필터 기능을 구현합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { LoginLogsFilterState } from "./login-logs-filter-popup";

interface LoginLogsFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: LoginLogsFilterState;
  onFiltersChange: (filters: LoginLogsFilterState) => void;
  onApplyFilters: () => void;
}

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

export function LoginLogsFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}: LoginLogsFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="사용자명, IP 주소 검색..."
    />
  );
}
