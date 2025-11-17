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
  searchFilters: Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>;
  onSearchFiltersChange: (filters: Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>) => void;
  onApply: () => void;
  items: FilterItemConfig[];
}

/**
 * 활성 검색 필터 개수 계산
 * 각 필터 key의 선택된 값의 총 개수를 계산 (배열의 길이 합계 + daterange 1개)
 *
 * 예시:
 * - status: ["ACTIVE", "INACTIVE"] → 2개
 * - userType: ["ADMIN"] → 1개
 * - createdAt: { type: "range", value: { from: "2025-11-18" } } → 1개
 * - 총: 4개
 */
function countActiveSearchFilters(
  searchFilters: Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>
): number {
  return Object.values(searchFilters).reduce((total, value) => {
    if (Array.isArray(value) && value.length > 0) {
      return total + value.length;
    }
    if (value && typeof value === "object" && "type" in value && "value" in value) {
      // daterange 필터가 from 또는 to 값을 가지면 1로 카운트
      const range = (value as { type: string; value: { from?: string; to?: string } }).value;
      if (range.from || range.to) {
        return total + 1;
      }
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
  const [tempSearchFilters, setTempSearchFilters] = useState<
    Record<string, string[] | null | { type: string; value: { from?: string; to?: string } }>
  >(searchFilters);

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
      <DialogContent className="sm:max-w-4xl h-[500px] flex flex-col p-6">
        {/* 헤더 */}
        <DialogHeader className="pb-4 flex-shrink-0">
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
        <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
          {/* 좌측: 검색 필터 항목 목록 */}
          <div className="w-48 border-r flex flex-col min-h-0">
            <div className="space-y-0.5 overflow-y-auto pr-2">
              {items.map((item) => {
                const isSelected = selectedItemKey === item.key;
                let hasValue = false;
                let valueCount = 0;

                const filterValue = tempSearchFilters[item.key];
                if (item.type === "daterange") {
                  // daterange 필터의 경우
                  if (
                    filterValue &&
                    typeof filterValue === "object" &&
                    "value" in filterValue
                  ) {
                    const range = (
                      filterValue as { type: string; value: { from?: string; to?: string } }
                    ).value;
                    hasValue = !!(range.from || range.to);
                    valueCount = (range.from ? 1 : 0) + (range.to ? 1 : 0);
                  }
                } else {
                  // 체크박스 필터의 경우
                  hasValue = Array.isArray(filterValue) && filterValue.length > 0;
                  valueCount = Array.isArray(filterValue) ? filterValue.length : 0;
                }

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
                          {valueCount > 0 ? valueCount : "✓"}
                        </Badge>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측: 선택된 검색 필터의 옵션 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            {selectedItem ? (
              <div className="space-y-4 h-full flex flex-col min-h-0">
                {/* 검색 바 */}
                <div className="flex items-center gap-2 pb-2 border-b flex-shrink-0">
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
                <div className="flex-1 overflow-y-auto min-h-0">
                  {selectedItem.type === "daterange" ? (
                    // 날짜 범위 필터
                    <div className="space-y-4 p-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">시작 날짜 (From)</label>
                        <Input
                          type="date"
                          value={
                            tempSearchFilters[selectedItem.key] &&
                            typeof tempSearchFilters[selectedItem.key] === "object" &&
                            "value" in tempSearchFilters[selectedItem.key]
                              ? (tempSearchFilters[selectedItem.key] as {
                                  type: string;
                                  value: { from?: string; to?: string };
                                }).value.from || ""
                              : ""
                          }
                          onChange={(e) => {
                            const from = e.target.value;
                            const currentValue =
                              tempSearchFilters[selectedItem.key] &&
                              typeof tempSearchFilters[selectedItem.key] === "object" &&
                              "value" in tempSearchFilters[selectedItem.key]
                                ? (tempSearchFilters[selectedItem.key] as {
                                    type: string;
                                    value: { from?: string; to?: string };
                                  }).value
                                : {};

                            setTempSearchFilters({
                              ...tempSearchFilters,
                              [selectedItem.key]: {
                                type: "range",
                                value: { ...currentValue, from: from || undefined },
                              },
                            });
                          }}
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">종료 날짜 (To)</label>
                        <Input
                          type="date"
                          value={
                            tempSearchFilters[selectedItem.key] &&
                            typeof tempSearchFilters[selectedItem.key] === "object" &&
                            "value" in tempSearchFilters[selectedItem.key]
                              ? (tempSearchFilters[selectedItem.key] as {
                                  type: string;
                                  value: { from?: string; to?: string };
                                }).value.to || ""
                              : ""
                          }
                          onChange={(e) => {
                            const to = e.target.value;
                            const currentValue =
                              tempSearchFilters[selectedItem.key] &&
                              typeof tempSearchFilters[selectedItem.key] === "object" &&
                              "value" in tempSearchFilters[selectedItem.key]
                                ? (tempSearchFilters[selectedItem.key] as {
                                    type: string;
                                    value: { from?: string; to?: string };
                                  }).value
                                : {};

                            setTempSearchFilters({
                              ...tempSearchFilters,
                              [selectedItem.key]: {
                                type: "range",
                                value: { ...currentValue, to: to || undefined },
                              },
                            });
                          }}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ) : filteredOptions.length > 0 ? (
                    // 체크박스 필터
                    <CheckboxGroup
                      options={filteredOptions}
                      selectedValues={
                        Array.isArray(tempSearchFilters[selectedItem.key])
                          ? (tempSearchFilters[selectedItem.key] as string[])
                          : []
                      }
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
