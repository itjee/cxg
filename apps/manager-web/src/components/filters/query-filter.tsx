"use client";

/**
 * @file query-filter.tsx
 * @description 쿼리 조건 관리 컴포넌트 (공통)
 *
 * 쿼리 텍스트(자유 텍스트)와 쿼리 필터 조건(선택형 옵션)을 함께 관리합니다.
 * Jira 스타일의 좌우 분할 필터 팝업을 사용합니다.
 *
 * 구조:
 * - QueryBar: 쿼리 텍스트 + 쿼리 필터 버튼 UI
 * - QueryFilterPopup: 좌우 분할 쿼리 필터 조건 선택 팝업 (멀티 선택)
 *
 * 용어 정의:
 * - queryText: 자유 검색 텍스트 (텍스트 입력)
 * - queryFilters: 쿼리 필터 조건들 (선택형 옵션)
 */

import { useState } from "react";
import { QueryBar } from "./query-bar";
import { QueryFilterPopup } from "./query-filter-popup";
import type { FilterItemConfig } from "./query-popup.types";

/**
 * 쿼리 조건 관리 Props
 */
export interface QueryFilterProps {
  // === 필수 props ===
  /** 쿼리 텍스트 (자유 검색 텍스트) */
  queryText: string;
  onQueryTextChange: (text: string) => void;

  /** 쿼리 필터 조건들 (선택형 옵션) */
  queryFilters: Record<string, string[] | null>;
  onQueryFiltersChange: (filters: Record<string, string[] | null>) => void;

  /** 적용 버튼 클릭 시 실행 (서버 쿼리 실행) */
  onApply: () => void;

  /** 쿼리 필터 항목 설정 */
  filterItems: FilterItemConfig[];

  // === 선택 props ===
  /** 쿼리 텍스트 입력 필드 플레이스홀더 */
  queryPlaceholder?: string;

  /** 쿼리 텍스트 입력란 CSS 클래스 (너비 제어 등) */
  queryInputClassName?: string;

  /** 우측에 배치할 커스텀 버튼들 */
  customButtons?: React.ReactNode;

  /** 모든 쿼리 필터 초기화 핸들러 (선택사항) */
  onClearAllFilters?: () => void;
}

/**
 * 쿼리 조건 관리 컴포넌트
 *
 * 쿼리 텍스트와 쿼리 필터 조건을 함께 관리하고
 * Jira 스타일 필터 팝업을 제공합니다.
 *
 * @example
 * ```tsx
 * <QueryFilter
 *   queryText={queryText}
 *   onQueryTextChange={setQueryText}
 *   queryFilters={queryFilters}
 *   onQueryFiltersChange={setQueryFilters}
 *   onApply={handleApply}
 *   filterItems={filterItems}
 *   queryPlaceholder="사용자 검색..."
 * />
 * ```
 */
export function QueryFilter({
  queryText,
  onQueryTextChange,
  queryFilters,
  onQueryFiltersChange,
  onApply,
  filterItems,
  queryPlaceholder = "검색...",
  queryInputClassName = "w-80",
  customButtons,
  onClearAllFilters,
}: QueryFilterProps) {
  const [queryFilterOpen, setQueryFilterOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 쿼리 텍스트 + 쿼리 필터 조건 바 */}
      <QueryBar
        queryText={queryText}
        onQueryTextChange={onQueryTextChange}
        queryFilters={queryFilters}
        onQueryFilterClick={() => setQueryFilterOpen(true)}
        onClearAllFilters={onClearAllFilters}
        queryPlaceholder={queryPlaceholder}
        queryInputClassName={queryInputClassName}
        customButtons={customButtons}
      />

      {/* 쿼리 필터 조건 선택 팝업 */}
      <QueryFilterPopup
        open={queryFilterOpen}
        onOpenChange={setQueryFilterOpen}
        queryFilters={queryFilters}
        onQueryFiltersChange={onQueryFiltersChange}
        onApply={onApply}
        items={filterItems}
      />
    </div>
  );
}

// 타입 export
export type { FilterItemConfig } from "./query-popup.types";
