"use client";

/**
 * @file search-filter-popup.tsx
 * @description Search 필터 조건 선택 팝업 (Jira 스타일)
 *
 * 좌측: 검색 필터 항목 목록
 * 우측: 선택된 검색 필터의 옵션 (체크박스)
 * 하단: 버튼들 (모두 지우기, 이 필터 지우기, 취소, 적용)
 *
 * 용어:
 * - searchFilters: 검색 필터 조건들 (선택형 옵션)
 */

import { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { CheckboxGroup } from "./search-checkbox-group";
import type { FilterItemConfig } from "./search-popup.types";

/**
 * Search 필터 팝업 Props
 */
export interface SearchFilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchFilters: Record<string, string[] | null>;
  onSearchFiltersChange: (filters: Record<string, string[] | null>) => void;
  onApply: () => void;
  items: FilterItemConfig[];
}

/**
 * 활성 검색 필터 개수 계산
 * 각 필터 key의 선택된 값의 총 개수를 계산 (배열의 길이 합계)
 *
 * 예시:
 * - status: ["ACTIVE", "INACTIVE"] → 2개
 * - userType: ["ADMIN"] → 1개
 * - 총: 3개
 */
function countActiveSearchFilters(searchFilters: Record<string, string[] | null>): number {
  return Object.values(searchFilters).reduce((total, value) => {
    if (Array.isArray(value) && value.length > 0) {
      return total + value.length;
    }
    return total;
  }, 0);
}

/**
 * Search 필터 조건 선택 팝업 (Jira 스타일)
 *
 * 좌우 분할 레이아웃으로 검색 필터 조건을 선택합니다.
 */
export function SearchFilterPopup({
  open,
  onOpenChange,
  searchFilters,
  onSearchFiltersChange,
  onApply,
  items,
}: SearchFilterPopupProps) {
  // 현재 선택된 검색 필터 항목 (좌측에서 선택)
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(
    items.length > 0 ? items[0].key : null
  );

  // 필터값 검색어
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 팝업 내에서의 임시 필터 상태 (적용 전까지 임시로 보관)
  const [tempSearchFilters, setTempSearchFilters] = useState<Record<string, string[] | null>>(searchFilters);

  const activeSearchFilterCount = countActiveSearchFilters(tempSearchFilters);

  // 현재 선택된 검색 필터 항목 객체
  const selectedItem = items.find((item) => item.key === selectedItemKey);

  // 팝업이 열릴 때 tempSearchFilters 초기화
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      // 팝업 열 때: 부모의 searchFilters를 임시 상태로 복사
      setTempSearchFilters(searchFilters);
      setSearchQuery("");
    } else {
      // 팝업 닫을 때: 취소 시 임시 상태 버림
      setTempSearchFilters(searchFilters);
    }
    onOpenChange(newOpen);
  }, [searchFilters, onOpenChange]);

  // 검색어에 따라 필터링된 옵션들
  const filteredOptions = useMemo(() => {
    if (!selectedItem || !searchQuery.trim()) {
      return selectedItem?.options || [];
    }
    const lowerQuery = searchQuery.toLowerCase();
    return (selectedItem?.options || []).filter((option) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [selectedItem, searchQuery]);

  /**
   * 선택된 검색 필터 항목의 체크박스 값 변경 (임시 상태만 업데이트)
   */
  const handleCheckboxChange = useCallback(
    (values: string[]) => {
      if (selectedItemKey) {
        setTempSearchFilters({
          ...tempSearchFilters,
          [selectedItemKey]: values.length > 0 ? values : null,
        });
      }
    },
    [selectedItemKey, tempSearchFilters]
  );

  /**
   * 모든 검색 필터 초기화 (임시 상태)
   */
  const handleClearAll = useCallback(() => {
    const resetFilters = items.reduce(
      (acc, item) => {
        acc[item.key] = null;
        return acc;
      },
      {} as Record<string, string[] | null>
    );
    setTempSearchFilters(resetFilters);
  }, [items]);

  /**
   * 현재 선택된 검색 필터만 초기화 (임시 상태)
   */
  const handleClearCurrent = useCallback(() => {
    if (selectedItemKey) {
      setTempSearchFilters({
        ...tempSearchFilters,
        [selectedItemKey]: null,
      });
    }
  }, [selectedItemKey, tempSearchFilters]);

  /**
   * 적용: 임시 필터를 부모에 반영하고 팝업 닫기
   */
  const handleApply = useCallback(() => {
    // 임시 필터를 부모 상태로 반영
    onSearchFiltersChange(tempSearchFilters);
    // 콜백 실행
    onApply();
    // 팝업 닫기
    onOpenChange(false);
  }, [tempSearchFilters, onSearchFiltersChange, onApply, onOpenChange]);

  /**
   * 필터 항목 선택 (검색어 초기화)
   */
  const handleSelectItem = useCallback((key: string) => {
    setSelectedItemKey(key);
    setSearchQuery("");
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[680px] flex flex-col p-6">
        {/* 헤더 */}
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-lg">검색 필터</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                필터 항목을 선택하고 값을 검색하여 멀티 선택할 수 있습니다.
              </DialogDescription>
            </div>
            {activeSearchFilterCount > 0 && (
              <Badge variant="secondary" className="rounded-md px-2 py-1 flex-shrink-0">
                {activeSearchFilterCount}개 선택됨
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* 본문: 좌우 분할 */}
        <div className="flex flex-1 gap-6 min-h-0">
          {/* 좌측: 검색 필터 항목 목록 */}
          <div className="w-48 border-r flex flex-col">
            <div className="space-y-0.5 overflow-y-auto pr-2">
              {items.map((item) => {
                const isSelected = selectedItemKey === item.key;
                const hasValue =
                  tempSearchFilters[item.key] && tempSearchFilters[item.key]!.length > 0;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelectItem(item.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground font-medium"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex-1">{item.label}</span>
                      {hasValue && (
                        <Badge
                          variant={isSelected ? "default" : "secondary"}
                          className="h-5 w-5 ml-2 flex items-center justify-center p-0 text-xs rounded-full flex-shrink-0"
                        >
                          {tempSearchFilters[item.key]!.length}
                        </Badge>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측: 선택된 검색 필터의 옵션 */}
          <div className="flex-1 min-w-0">
            {selectedItem ? (
              <div className="space-y-4 h-full flex flex-col">
                {/* 검색 바 */}
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder={`${selectedItem.label} 검색...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm h-8"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        title="검색 초기화"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCurrent}
                    disabled={
                      !tempSearchFilters[selectedItem.key] ||
                      tempSearchFilters[selectedItem.key]!.length === 0
                    }
                    className="text-xs h-8 flex-shrink-0"
                  >
                    지우기
                  </Button>
                </div>

                {/* 필터 옵션 목록 */}
                <div className="flex-1 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    <CheckboxGroup
                      options={filteredOptions}
                      selectedValues={tempSearchFilters[selectedItem.key] || []}
                      onValuesChange={handleCheckboxChange}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                왼쪽에서 검색 필터를 선택해주세요
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <Separator className="my-4" />

        {/* 하단: 버튼 */}
        <DialogFooter className="flex items-center justify-between pt-2">
          {/* 좌측: 모두 지우기 */}
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={activeSearchFilterCount === 0}
            className="flex-shrink-0"
          >
            모두 지우기
          </Button>

          {/* 우측: 취소, 적용 */}
          <div className="flex gap-2 ml-auto flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-20"
            >
              취소
            </Button>
            <Button
              onClick={handleApply}
              className="w-20"
            >
              적용
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
