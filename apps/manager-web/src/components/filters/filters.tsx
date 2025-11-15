"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * 필터 컨트롤 타입
 */
export type FilterControlType =
  | "text"
  | "search"
  | "select"
  | "multiSelect"
  | "date"
  | "dateRange"
  | "checkbox"
  | "number";

/**
 * 필터 옵션 (Select 타입용)
 */
export interface FilterOption {
  label: string;
  value: string | number;
}

/**
 * 필터 정의
 */
export interface FilterConfig {
  /**
   * 필터 고유 키 (store setter 메서드 이름)
   */
  key: string;

  /**
   * 필터 라벨
   */
  label: string;

  /**
   * 필터 설명 (placeholder, tooltip 등)
   */
  description?: string;

  /**
   * 컨트롤 타입
   */
  type: FilterControlType;

  /**
   * Select/MultiSelect/Checkbox 타입일 때 옵션 배열
   */
  options?: FilterOption[];

  /**
   * 너비 설정 (tailwind 클래스: 'w-full', 'w-1/2' 등)
   */
  width?: string;

  /**
   * 초기값
   */
  defaultValue?: string | string[] | number;

  /**
   * 필터 placeholder (select, text, search, number 타입)
   */
  placeholder?: string;
}

export interface FiltersProps {
  /**
   * 필터 설정 배열
   */
  filters: FilterConfig[];

  /**
   * 필터 값 객체 또는 초기값
   */
  values?: Record<string, any>;

  /**
   * 필터 변경 콜백 (실시간 업데이트)
   */
  onChange?: (key: string, value: string | string[] | number) => void;

  /**
   * 필터 섹션 제목
   */
  title?: string;

  /**
   * 초기 확장 상태
   */
  defaultExpanded?: boolean;

  /**
   * 초기화 콜백 (선택사항)
   */
  onReset?: () => void;

  /**
   * 커스텀 클래스
   */
  className?: string;
}

/**
 * 공통 필터 컴포넌트 (Expanded 스타일만)
 * 다양한 필터 타입을 동적으로 지원합니다:
 * - text: 기본 텍스트 입력
 * - search: 검색 아이콘이 있는 텍스트 입력
 * - select: 단일 선택 드롭다운
 * - multiSelect: 다중 선택 체크박스
 * - date: 단일 날짜 입력
 * - dateRange: 시작일-종료일 범위 입력
 * - number: 숫자 입력
 * - checkbox: 다중 선택 체크박스 (checkbox)
 */
export function Filters({
  filters,
  values: propsValues = {},
  onChange,
  title = "검색필터",
  defaultExpanded = true,
  onReset,
  className = "",
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleFilterChange = (key: string, value: any) => {
    onChange?.(key, value);
  };

  const handleReset = () => {
    onReset?.();
  };

  /**
   * 텍스트/서치 입력 렌더링
   */
  const renderTextInput = (filter: FilterConfig, value: any) => {
    const isSearch = filter.type === "search";
    return (
      <div className={isSearch ? "relative" : ""}>
        {isSearch && (
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        <Input
          type="text"
          placeholder={filter.description || filter.placeholder}
          value={value as string}
          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          className={cn("bg-background border-input", isSearch && "pl-10")}
        />
      </div>
    );
  };

  /**
   * 날짜 입력 렌더링
   */
  const renderDateInput = (filter: FilterConfig, value: any) => {
    return (
      <Input
        type="date"
        value={value as string}
        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
        className="bg-background border-input"
      />
    );
  };

  /**
   * 날짜 범위 입력 렌더링
   */
  const renderDateRangeInput = (filter: FilterConfig, value: any) => {
    return (
      <div className="flex gap-2">
        <Input
          type="date"
          placeholder="시작일"
          value={(value as any)?.[0] || ""}
          onChange={(e) => {
            const currentRange = (value as any) ?? ["", ""];
            handleFilterChange(filter.key, [e.target.value, currentRange[1]]);
          }}
          className="bg-background border-input"
        />
        <Input
          type="date"
          placeholder="종료일"
          value={(value as any)?.[1] || ""}
          onChange={(e) => {
            const currentRange = (value as any) ?? ["", ""];
            handleFilterChange(filter.key, [currentRange[0], e.target.value]);
          }}
          className="bg-background border-input"
        />
      </div>
    );
  };

  /**
   * 숫자 입력 렌더링
   */
  const renderNumberInput = (filter: FilterConfig, value: any) => {
    return (
      <Input
        type="number"
        placeholder={filter.description || filter.placeholder}
        value={value as number}
        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
        className="bg-background border-input"
      />
    );
  };

  /**
   * Select 드롭다운 렌더링
   */
  const renderSelectInput = (filter: FilterConfig, value: any) => {
    if (!filter.options) return null;

    return (
      <Select
        value={value === "" ? "all" : String(value)}
        onValueChange={(newValue) =>
          handleFilterChange(filter.key, newValue === "all" ? "" : newValue)
        }
      >
        <SelectTrigger className="bg-background border-input">
          <SelectValue
            placeholder={filter.description || filter.placeholder || "전체"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          {filter.options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  /**
   * MultiSelect 체크박스 렌더링
   */
  const renderMultiSelectInput = (filter: FilterConfig, value: any) => {
    if (!filter.options) return null;

    return (
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {filter.options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={
                (value as (string | number)[])?.includes(option.value) ?? false
              }
              onChange={(e) => {
                const currentValues = (value as (string | number)[]) ?? [];
                if (e.target.checked) {
                  handleFilterChange(filter.key, [
                    ...currentValues,
                    option.value,
                  ]);
                } else {
                  handleFilterChange(
                    filter.key,
                    currentValues.filter((v) => v !== option.value)
                  );
                }
              }}
              className="rounded border-input"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    );
  };

  /**
   * Checkbox 렌더링 (multiSelect와 동일)
   */
  const renderCheckboxInput = (filter: FilterConfig, value: any) => {
    if (!filter.options) return null;

    return (
      <div className="space-y-2">
        {filter.options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={
                (value as (string | number)[])?.includes(option.value) ?? false
              }
              onChange={(e) => {
                const currentValues = (value as (string | number)[]) ?? [];
                if (e.target.checked) {
                  handleFilterChange(filter.key, [
                    ...currentValues,
                    option.value,
                  ]);
                } else {
                  handleFilterChange(
                    filter.key,
                    currentValues.filter((v) => v !== option.value)
                  );
                }
              }}
              className="rounded border-input"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    );
  };

  /**
   * 필터 타입에 따라 적절한 입력 필드 렌더링
   */
  const renderFilterField = (filter: FilterConfig) => {
    const value = propsValues[filter.key] ?? "";

    return (
      <div key={filter.key} className={filter.width || "w-full"}>
        <label className="block text-sm font-medium text-foreground mb-2">
          {filter.label}
        </label>

        {/* Text Input */}
        {(filter.type === "text" || filter.type === "search") &&
          renderTextInput(filter, value)}

        {/* Date Input */}
        {filter.type === "date" && renderDateInput(filter, value)}

        {/* Date Range Input */}
        {filter.type === "dateRange" && renderDateRangeInput(filter, value)}

        {/* Number Input */}
        {filter.type === "number" && renderNumberInput(filter, value)}

        {/* Select */}
        {filter.type === "select" && renderSelectInput(filter, value)}

        {/* Multi-Select */}
        {filter.type === "multiSelect" && renderMultiSelectInput(filter, value)}

        {/* Checkbox */}
        {filter.type === "checkbox" && renderCheckboxInput(filter, value)}
      </div>
    );
  };

  // Expanded variant (default)
  return (
    <div className={className}>
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
              title="필터 초기화"
            >
              초기화
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-1 hover:bg-accent rounded-md transition-colors"
            title={isExpanded ? "필터 숨기기" : "필터 보이기"}
          >
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                isExpanded ? "" : "-rotate-90"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 필터 컨텐츠 */}
      {isExpanded && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => renderFilterField(filter))}
          </div>
        </div>
      )}
    </div>
  );
}
