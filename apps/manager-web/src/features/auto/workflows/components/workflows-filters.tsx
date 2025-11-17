"use client";

/**
 * @file workflows-filters.tsx
 * @description 워크플로우 검색/필터 UI
 * 
 * 역할:
 * - 검색 입력
 * - 필터 옵션
 * - Filters 컴포넌트 사용
 * - 스토어 연동
 */

import { useMemo } from "react";
import { SearchFilters, type FilterConfig } from "@/components/filters";
import { useWorkflowsStore } from "../stores";
import type { Workflows } from "../types";

interface WorkflowsFiltersProps {
  data: Workflows[];
}

/**
 * 워크플로우 필터 컴포넌트
 */
export function WorkflowsFilters({ data }: WorkflowsFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useWorkflowsStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "워크플로우명, 설명...",
      type: "search",
    },
    {
      key: "selectedStatus",
      label: "상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "활성", value: "true" },
        { label: "비활성", value: "false" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedStatus,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedStatus: setSelectedStatus,
    };
    handlers[key]?.(value);
  };

  return (
    <SearchFilters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
