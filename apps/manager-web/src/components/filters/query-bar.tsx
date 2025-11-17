"use client";

/**
 * @file query-bar.tsx
 * @description 쿼리 입력 바 (공통 컴포넌트)
 *
 * 모든 검색/쿼리 페이지에서 재사용할 수 있는 쿼리 바
 * - 좌측: 쿼리 텍스트 입력란 + 쿼리 필터 버튼
 * - 우측: 페이지별 커스텀 버튼들
 *
 * 용어 정의:
 * - queryText: 자유 검색 텍스트 (텍스트 입력)
 * - queryFilters: 쿼리 필터 조건들 (선택형 옵션)
 * - 둘 다 서버로 전송되는 "쿼리 조건"
 */

import { useCallback, ReactNode, useMemo } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 활성화된 쿼리 필터 개수 계산
 * queryFilters 값이 배열 또는 단일값일 수 있으므로 처리
 */
function countActiveQueryFilters(queryFilters: Record<string, any>): number {
  return Object.values(queryFilters).filter((value) => {
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }).length;
}

/**
 * 쿼리 바 Props
 */
export interface QueryBarProps {
  /** 쿼리 텍스트 (자유 검색 텍스트) */
  queryText: string;
  onQueryTextChange: (text: string) => void;

  /** 쿼리 필터 조건들 */
  queryFilters: Record<string, any>;

  /** 쿼리 필터 버튼 클릭 핸들러 (팝업 오픈) */
  onQueryFilterClick: () => void;

  /** 쿼리 텍스트 입력 필드 플레이스홀더 */
  queryPlaceholder?: string;

  /** 쿼리 텍스트 입력란 CSS 클래스 (너비 제어 등) */
  queryInputClassName?: string;

  /** 우측에 배치할 커스텀 버튼들 */
  customButtons?: ReactNode;
}

/**
 * 쿼리 입력 바
 *
 * 쿼리 텍스트와 쿼리 필터를 함께 관리하는 공통 UI 컴포넌트
 * 팝업은 부모 컴포넌트에서 관리하고 이 컴포넌트는 UI만 담당
 */
export function QueryBar({
  queryText,
  onQueryTextChange,
  queryFilters,
  onQueryFilterClick,
  queryPlaceholder = "검색...",
  queryInputClassName = "w-80",
  customButtons,
}: QueryBarProps) {
  // 활성화된 쿼리 필터 개수 계산 (메모이제이션)
  const activeQueryFilterCount = useMemo(
    () => countActiveQueryFilters(queryFilters),
    [queryFilters]
  );

  // 쿼리 텍스트 초기화
  const handleClearQueryText = useCallback(() => {
    onQueryTextChange("");
  }, [onQueryTextChange]);

  return (
    <div className="flex items-center gap-2">
      {/* === 좌측: 쿼리 텍스트 입력란 === */}
      <div className={`relative ${queryInputClassName}`}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={queryPlaceholder}
          value={queryText}
          onChange={(e) => onQueryTextChange(e.target.value)}
          className="pl-10 rounded-md"
        />
        {/* 쿼리 텍스트 초기화 버튼 */}
        {queryText && (
          <button
            onClick={handleClearQueryText}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            title="쿼리 텍스트 초기화"
          >
            ✕
          </button>
        )}
      </div>

      {/* === 쿼리 필터 버튼 === */}
      <Button
        variant={activeQueryFilterCount > 0 ? "default" : "outline"}
        size="sm"
        onClick={onQueryFilterClick}
        className="gap-2 relative whitespace-nowrap rounded-md"
      >
        <Filter className="h-4 w-4" />
        <span>필터</span>
        {/* 활성 쿼리 필터 개수 배지 */}
        {activeQueryFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-md"
          >
            {activeQueryFilterCount}
          </Badge>
        )}
      </Button>

      {/* === 우측: 커스텀 버튼들 + 기본 더보기 버튼 === */}
      <div className="ml-auto flex items-center gap-2">
        {/* 페이지별 커스텀 버튼들 */}
        {customButtons}

        {/* 기본 [...] 더보기 버튼 */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 rounded-md"
          title="더보기"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}