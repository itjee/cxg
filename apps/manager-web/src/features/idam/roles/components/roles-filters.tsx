"use client";

/**
 * @file roles-filters.tsx
 * @description 역할 검색 및 필터 컴포넌트
 *
 * Filters 컴포넌트를 사용하여 검색 및 필터 기능 제공
 */

import { useMemo } from "react";
import { Filters } from "@/components/filters/filters";
import { useRolesStore } from "../stores/roles.store";

export function RolesFilters() {
  const {
    selectedStatus,
    globalFilter,
    setSelectedStatus,
    setGlobalFilter,
    resetFilters,
  } = useRolesStore();

  const filterFields = useMemo(
    () => [
      {
        key: "globalFilter",
        type: "search" as const,
        label: "검색",
        placeholder: "역할명 검색...",
      },
      {
        key: "selectedStatus",
        type: "select" as const,
        label: "상태",
        placeholder: "전체",
        options: [
          { label: "활성", value: "active" },
          { label: "비활성", value: "inactive" },
        ],
      },
    ],
    []
  );

  const filterValues = useMemo(
    () => ({
      globalFilter,
      selectedStatus: selectedStatus || "",
    }),
    [globalFilter, selectedStatus]
  );

  const handleFilterChange = (key: string, value: any) => {
    if (key === "globalFilter") {
      setGlobalFilter(value);
    } else if (key === "selectedStatus") {
      setSelectedStatus(value);
    }
  };

  return (
    <Filters
      filters={filterFields}
      values={filterValues}
      onChange={handleFilterChange}
      onReset={resetFilters}
      title="검색필터"
    />
  );
}
