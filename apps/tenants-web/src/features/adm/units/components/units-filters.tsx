"use client";

import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { useUnitStore } from "../stores";
import type { Unit } from "../types/units.types";

interface UnitsFiltersProps {
  units: Unit[];
}

/**
 * Units 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useUnitStore와 연동
 */
export function UnitsFilters({ units }: UnitsFiltersProps) {
  const {
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useUnitStore();

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: "selectedStatus",
        label: "상태",
        description: "전체 상태",
        type: "select",
        options: [
          { label: "활성", value: "active" },
          { label: "비활성", value: "inactive" },
        ],
      },
    ],
    []
  );

  // 필터 값 객체
  const filterValues = {
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case "selectedStatus":
        setSelectedStatus(value as string);
        break;
    }
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
