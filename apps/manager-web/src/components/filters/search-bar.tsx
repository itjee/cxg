"use client";

/**
 * @file search-bar.tsx
 * @description 검색 입력 바 (공통 컴포넌트)
 *
 * 모든 검색 페이지에서 재사용할 수 있는 검색 바
 * - 좌측: 검색 텍스트 입력란 + 검색 필터 버튼
 * - 우측: 페이지별 커스텀 버튼들
 *
 * 용어 정의:
 * - searchText: 자유 검색 텍스트 (텍스트 입력)
 * - searchFilters: 검색 필터 조건들 (선택형 옵션)
 * - 둘 다 서버로 전송되는 "검색 조건"
 */

import { useCallback, ReactNode, useMemo } from "react";
import { Search, Filter, MoreHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 활성화된 검색 필터 개수 계산
 * 각 필터 key의 선택된 값의 총 개수를 계산 (배열의 길이 합계)
 *
 * 예시:
 * - status: ["ACTIVE", "INACTIVE"] → 2개
 * - userType: ["ADMIN"] → 1개
 * - 총: 3개
 */
function countActiveSearchFilters(searchFilters: Record<string, any>): number {
  return Object.values(searchFilters).reduce((total, value) => {
    if (Array.isArray(value) && value.length > 0) {
      return total + value.length;
    }
    return total;
  }, 0);
}

/**
 * 검색 바 Props
 */
export interface SearchBarProps {
  /** 검색 텍스트 (자유 검색 텍스트) */
  searchText: string;
  onSearchTextChange: (text: string) => void;

  /** 검색 필터 조건들 */
  searchFilters: Record<string, any>;

  /** 검색 필터 버튼 클릭 핸들러 (팝업 오픈) */
  onSearchFilterClick: () => void;

  /** 모든 검색 필터 초기화 핸들러 (선택사항) */
  onClearAllSearchFilters?: () => void;

  /** 검색 텍스트 입력 필드 플레이스홀더 */
  searchPlaceholder?: string;

  /** 검색 텍스트 입력란 CSS 클래스 (너비 제어 등) */
  searchInputClassName?: string;

  /** 우측에 배치할 커스텀 버튼들 */
  customButtons?: ReactNode;
}

/**
 * 검색 입력 바
 *
 * 검색 텍스트와 검색 필터를 함께 관리하는 공통 UI 컴포넌트
 * 팝업은 부모 컴포넌트에서 관리하고 이 컴포넌트는 UI만 담당
 */
export function SearchBar({
  searchText,
  onSearchTextChange,
  searchFilters,
  onSearchFilterClick,
  onClearAllSearchFilters,
  searchPlaceholder = "검색...",
  searchInputClassName = "w-80",
  customButtons,
}: SearchBarProps) {
  // 활성화된 검색 필터 개수 계산 (메모이제이션)
  const activeSearchFilterCount = useMemo(
    () => countActiveSearchFilters(searchFilters),
    [searchFilters]
  );

  // 검색 텍스트 초기화
  const handleClearSearchText = useCallback(() => {
    onSearchTextChange("");
  }, [onSearchTextChange]);

  return (
    <div className="flex items-center gap-2">
      {/* === 좌측: 검색 텍스트 입력란 === */}
      <div className={`relative ${searchInputClassName}`}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          className="pl-10 rounded-md"
        />
        {/* 검색 텍스트 초기화 버튼 */}
        {searchText && (
          <button
            onClick={handleClearSearchText}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            title="검색 텍스트 초기화"
          >
            ✕
          </button>
        )}
      </div>

      {/* === 검색 필터 버튼 === */}
      <div className="flex items-center gap-1">
        <Button
          variant={activeSearchFilterCount > 0 ? "default" : "outline"}
          size="sm"
          onClick={onSearchFilterClick}
          className="gap-2 relative whitespace-nowrap rounded-md text-xs"
        >
          <Filter className="h-4 w-4" />
          <span>필터</span>
          {/* 활성 검색 필터 개수 배지 */}
          {activeSearchFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-md"
            >
              {activeSearchFilterCount}
            </Badge>
          )}
        </Button>

        {/* 필터 초기화 버튼 (필터가 선택된 경우만 표시) */}
        {activeSearchFilterCount > 0 && onClearAllSearchFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllSearchFilters}
            className="gap-2 whitespace-nowrap rounded-md text-xs"
            title="필터 초기화"
          >
            <X className="h-4 w-4" />
            <span>필터 지우기</span>
          </Button>
        )}
      </div>

      {/* === 우측: 커스텀 버튼들 + 기본 더보기 버튼 === */}
      <div className="ml-auto flex items-center gap-2">
        {/* 페이지별 커스텀 버튼들 */}
        {customButtons}

        {/* 기본 [...] 더보기 버튼 */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-md text-xs"
          title="더보기"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}