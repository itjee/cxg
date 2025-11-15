"use client";

/**
 * @file users-filters.tsx
 * @description 사용자 검색 및 필터 컴포넌트
 *
 * ListFilter 컴포넌트를 사용하여 검색 및 필터 기능 제공
 */

import { useMemo } from "react";
import { Filters } from "@/components/filters/filters";
import { useUsersStore } from "../stores/users.store";

export function UsersFilters() {
  const {
    selectedStatus,
    globalFilter,
    setSelectedStatus,
    setGlobalFilter,
    resetFilters,
  } = useUsersStore();

  const filterFields = useMemo(
    () => [
      {
        key: "globalFilter",
        type: "search" as const,
        label: "검색",
        placeholder: "사용자명 검색...",
      },
      {
        key: "selectedStatus",
        type: "select" as const,
        label: "상태",
        placeholder: "전체",
        options: [
          { label: "활성", value: "ACTIVE" },
          { label: "비활성", value: "INACTIVE" },
          { label: "잠금", value: "LOCKED" },
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
