"use client";

import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { useSettingsStore } from "../stores";
import type { Setting } from "../types/settings.types";

interface SettingsFiltersProps {
  settings: Setting[];
}

/**
 * Settings 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 useSettingStore와 연동
 */
export function SettingsFilters({ settings }: SettingsFiltersProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
  } = useSettingsStore();

  // 고유한 카테고리 목록 생성
  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(settings.map((s) => s.category).filter(Boolean))
    ) as string[];
  }, [settings]);

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: "selectedCategory",
        label: "카테고리",
        description: "전체 카테고리",
        type: "select",
        options: uniqueCategories.map((category) => ({
          label: category,
          value: category,
        })),
      },
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
    [uniqueCategories]
  );

  // 필터 값 객체
  const filterValues = {
    selectedCategory,
    selectedStatus,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case "selectedCategory":
        setSelectedCategory(value as string);
        break;
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
