"use client";

/**
 * @file users-filter.tsx
 * @description Users 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter 컴포넌트를 사용하여
 * Users 모듈의 검색 + 필터 조건을 구성합니다.
 * 필터: 상태, 사용자 유형, MFA, 비밀번호 상태, 생성일시
 */

import { SearchFilter } from "@/components/filters";
import type { FilterItemConfig } from "@/components/filters";

interface UsersFilterProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchFilters: Record<string, string[] | null | { type: string; value: string }>;
  onSearchFiltersChange: (filters: Record<string, string[] | null | { type: string; value: string }>) => void;
  onApplySearch: () => void;
  onClearAllSearchFilters?: () => void;
}

/**
 * Users 검색 필터 항목 설정
 *
 * 필터 종류:
 * - checkbox: 다중 선택 (status, userType, mfaEnabled, forcePasswordChange)
 * - daterange: 날짜 범위 (createdAt)
 */
const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "계정상태",
    type: "checkbox",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
      { value: "LOCKED", label: "잠금" },
      { value: "SUSPENDED", label: "정지됨" },
    ],
  },
  {
    key: "userType",
    label: "사용자 유형",
    type: "checkbox",
    options: [
      { value: "MASTER", label: "최고관리자" },
      { value: "TENANT", label: "테넌트관리자" },
      { value: "SYSTEM", label: "시스템사용자" },
      { value: "ADMIN", label: "관리자" },
      { value: "USER", label: "사용자" },
    ],
  },
  {
    key: "mfaEnabled",
    label: "MFA 상태",
    type: "checkbox",
    options: [
      { value: "true", label: "MFA 활성화됨" },
      { value: "false", label: "MFA 비활성화됨" },
    ],
  },
  {
    key: "forcePasswordChange",
    label: "비밀번호",
    type: "checkbox",
    options: [
      { value: "true", label: "변경 필요" },
      { value: "false", label: "정상" },
    ],
  },
  {
    key: "createdAt",
    label: "생성일시",
    type: "daterange",
    options: [], // daterange는 옵션 불필요
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
