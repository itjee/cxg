"use client";

/**
 * @file users-filters.tsx
 * @description 사용자 검색 및 필터 컴포넌트
 * 
 * ListFilter 컴포넌트를 사용하여 검색 및 필터 기능 제공
 */

import { useMemo } from "react";
import { ListFilter } from "@/components/filters/list-filter";
import { useUsersStore } from "../stores/users.store";
import type { Users } from "../types/users.types";

interface UsersFiltersProps {
  users: Users[];
}

export function UsersFilters({ users }: UsersFiltersProps) {
  const {
    selectedStatus,
    globalFilter,
    setSelectedStatus,
    setGlobalFilter,
    resetFilters,
  } = useUsersStore();

  const filterFields = useMemo(() => [
    {
      name: "globalFilter",
      type: "text" as const,
      label: "검색",
      placeholder: "사용자명 검색...",
    },
    {
      name: "selectedStatus",
      type: "select" as const,
      label: "상태",
      placeholder: "전체",
      options: [
        { label: "전체", value: "" },
        { label: "활성", value: "active" },
        { label: "비활성", value: "inactive" },
      ],
    },
  ], []);

  const filterValues = useMemo(() => ({
    globalFilter,
    selectedStatus,
  }), [globalFilter, selectedStatus]);

  const handleFilter = (values: Record<string, any>) => {
    setGlobalFilter(values.globalFilter || "");
    setSelectedStatus(values.selectedStatus || "");
  };

  return (
    <ListFilter
      fields={filterFields}
      defaultValues={filterValues}
      onFilter={handleFilter}
      onReset={resetFilters}
    />
  );
}
