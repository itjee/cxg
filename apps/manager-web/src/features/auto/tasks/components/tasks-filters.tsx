"use client";

/**
 * @file tasks-filters.tsx
 * @description 스케줄된 작업 검색/필터 UI
 */

import { SearchFilters, type FilterConfig } from "@/components/filters";
import { useTasksStore } from "../stores";
import type { Task } from "../types";

interface TasksFiltersProps {
  data: Task[];
}

export function TasksFilters({ data }: TasksFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedTaskType,
    setSelectedTaskType,
    selectedEnabled,
    setSelectedEnabled,
    selectedLastRunStatus,
    setSelectedLastRunStatus,
    resetFilters,
  } = useTasksStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "작업명, 설명...",
      type: "search",
    },
    {
      key: "selectedTaskType",
      label: "작업 유형",
      description: "전체 유형",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "시스템 정리", value: "SYSTEM_CLEANUP" },
        { label: "데이터 동기화", value: "DATA_SYNC" },
        { label: "리포트 생성", value: "REPORT_GENERATION" },
        { label: "백업", value: "BACKUP" },
        { label: "유지보수", value: "MAINTENANCE" },
        { label: "모니터링", value: "MONITORING" },
      ],
    },
    {
      key: "selectedEnabled",
      label: "활성 상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "활성", value: "true" },
        { label: "비활성", value: "false" },
      ],
    },
    {
      key: "selectedLastRunStatus",
      label: "마지막 실행 상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "전체", value: "" },
        { label: "성공", value: "SUCCESS" },
        { label: "실패", value: "FAILED" },
        { label: "타임아웃", value: "TIMEOUT" },
        { label: "취소", value: "CANCELED" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedTaskType,
    selectedEnabled,
    selectedLastRunStatus,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedTaskType: setSelectedTaskType,
      selectedEnabled: setSelectedEnabled,
      selectedLastRunStatus: setSelectedLastRunStatus,
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
