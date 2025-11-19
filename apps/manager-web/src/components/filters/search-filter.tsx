"use client";

/**
 * @file search-filter.tsx
 * @description 검색 조건 관리 컴포넌트 (공통)
 *
 * 검색 텍스트(자유 텍스트)와 검색 필터 조건(선택형 옵션)을 함께 관리합니다.
 * Jira 스타일의 좌우 분할 필터 팝업을 사용합니다.
 *
 * 구조:
 * - SearchBar: 검색 텍스트 + 검색 필터 버튼 UI
 * - SearchFilterPopup: 좌우 분할 검색 필터 조건 선택 팝업 (멀티 선택)
 *
 * 용어 정의:
 * - searchText: 자유 검색 텍스트 (텍스트 입력)
 * - searchFilters: 검색 필터 조건들 (선택형 옵션)
 */

import { useState } from "react";
import { SearchBar } from "./search-bar";
import { SearchFilterPopup } from "./search-filter-popup";
import type { FilterItemConfig } from "./search-popup.types";

/**
 * 필터 값 타입
 * - string[]: 다중 선택 필터 값
 * - null: 선택되지 않은 필터
 * - { type: string; value: { from?: string; to?: string } }: daterange 필터 값
 */
type FilterValue = string[] | null | { type: string; value: { from?: string; to?: string } };

/**
 * 검색 조건 관리 Props
 */
export interface SearchFilterProps {
  // === 필수 props ===
  /** 검색 텍스트 (자유 검색 텍스트) */
  searchText: string;
  onSearchTextChange: (text: string) => void;

  /** 검색 필터 조건들 (선택형 옵션) */
  searchFilters: Record<string, FilterValue>;
  onSearchFiltersChange: (filters: Record<string, FilterValue>) => void;

  /** 적용 버튼 클릭 시 실행 (서버 검색 실행) */
  onApply: () => void;

  /** 검색 필터 항목 설정 */
  filterItems: FilterItemConfig[];

  // === 선택 props ===
  /** 검색 텍스트 입력 필드 플레이스홀더 */
  searchPlaceholder?: string;

  /** 검색 텍스트 입력란 CSS 클래스 (너비 제어 등) */
  searchInputClassName?: string;

  /** 우측에 배치할 커스텀 버튼들 */
  customButtons?: React.ReactNode;

  /** 모든 검색 필터 초기화 핸들러 (선택사항) */
  onClearAllSearchFilters?: () => void;
}

/**
 * 검색 조건 관리 컴포넌트
 *
 * 검색 텍스트와 검색 필터 조건을 함께 관리하고
 * Jira 스타일 필터 팝업을 제공합니다.
 *
 * @example
 * ```tsx
 * <SearchFilter
 *   searchText={searchText}
 *   onSearchTextChange={setSearchText}
 *   searchFilters={searchFilters}
 *   onSearchFiltersChange={setSearchFilters}
 *   onApply={handleApply}
 *   filterItems={filterItems}
 *   searchPlaceholder="사용자 검색..."
 * />
 * ```
 */
export function SearchFilter({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFiltersChange,
  onApply,
  filterItems,
  searchPlaceholder = "검색...",
  searchInputClassName = "w-80",
  customButtons,
  onClearAllSearchFilters,
}: SearchFilterProps) {
  const [searchFilterOpen, setSearchFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 검색 텍스트 + 검색 필터 조건 바 */}
      <SearchBar
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        searchFilters={searchFilters}
        onSearchFilterClick={() => setSearchFilterOpen(true)}
        onClearAllSearchFilters={onClearAllSearchFilters}
        searchPlaceholder={searchPlaceholder}
        searchInputClassName={searchInputClassName}
        customButtons={customButtons}
      />

      {/* 검색 필터 조건 선택 팝업 */}
      <SearchFilterPopup
        open={searchFilterOpen}
        onOpenChange={setSearchFilterOpen}
        searchFilters={searchFilters}
        onSearchFiltersChange={onSearchFiltersChange}
        onApply={onApply}
        items={filterItems}
      />
    </div>
  );
}

// 타입 export
export type { FilterItemConfig } from "./search-popup.types";
