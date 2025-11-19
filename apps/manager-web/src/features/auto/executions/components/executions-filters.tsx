"use client";

/**
 * @file executions-filters.tsx
 * @description 실행 이력 검색/필터 UI
 * 
 * 역할:
 * - 검색 입력
 * - 필터 옵션
 * - Filters 컴포넌트 사용
 * - 스토어 연동
 */

import { useMemo } from "react";
import { SearchFilterPopup, type FilterConfig } from "@/components/filters";
import { useExecutionsStore } from "../stores";
import type { Execution } from "../types";

/**
 * 필터 값 타입
 */
type FilterValue = string[] | null | { type: string; value: { from?: string; to?: string } };

interface ExecutionsFiltersProps {
  data: Execution[];
}

export function ExecutionsFilters({ data }: ExecutionsFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedStatus,
    setSelectedStatus,
    selectedTriggerSource,
    setSelectedTriggerSource,
    resetFilters,
  } = useExecutionsStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "실행 ID, 단계명...",
      type: "search",
    },
    {
      key: "selectedStatus",
      label: "실행 상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "대기", value: "PENDING" },
        { label: "실행중", value: "RUNNING" },
        { label: "완료", value: "COMPLETED" },
        { label: "실패", value: "FAILED" },
        { label: "취소", value: "CANCELED" },
        { label: "타임아웃", value: "TIMEOUT" },
      ],
    },
    {
      key: "selectedTriggerSource",
      label: "트리거 소스",
      description: "전체 트리거",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "스케줄", value: "SCHEDULED" },
        { label: "이벤트", value: "EVENT" },
        { label: "수동", value: "MANUAL" },
        { label: "웹훅", value: "WEBHOOK" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedStatus,
    selectedTriggerSource,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedStatus: setSelectedStatus,
      selectedTriggerSource: setSelectedTriggerSource,
    };
    handlers[key]?.(value);
  };

  return (
    <SearchFilterPopup
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
