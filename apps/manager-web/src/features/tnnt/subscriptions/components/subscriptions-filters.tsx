"use client";

/**
 * @file subscriptions-filters.tsx
 * @description 구독 검색/필터 UI 컴포넌트
 *
 * 역할:
 * - 검색 입력
 * - 필터 옵션 (상태, 청구주기, 자동갱신)
 * - Zustand 스토어 연동
 */

import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { useSubscriptionsStore } from "../stores/subscriptions.store";
import type { Subscription } from "../types/subscriptions.types";

interface SubscriptionsFiltersProps {
  data: Subscription[];
}

export function SubscriptionsFilters({ data }: SubscriptionsFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStatus,
    setSelectedStatus,
    selectedBillingCycle,
    setSelectedBillingCycle,
    selectedAutoRenewal,
    setSelectedAutoRenewal,
    resetFilters,
  } = useSubscriptionsStore();

  // 고유 청구주기 추출
  const uniqueBillingCycles = useMemo(() => {
    const cycles = Array.from(new Set(data.map((s) => s.billing_cycle)));
    return cycles;
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: "globalFilter",
      label: "검색",
      description: "테넌트 ID, 플랜 ID로 검색",
      type: "search",
    },
    {
      key: "selectedStatus",
      label: "상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "활성", value: "ACTIVE" },
        { label: "일시중단", value: "SUSPENDED" },
        { label: "만료", value: "EXPIRED" },
        { label: "해지", value: "CANCELED" },
      ],
    },
    {
      key: "selectedBillingCycle",
      label: "청구주기",
      description: "전체 청구주기",
      type: "select",
      options: [
        { label: "월별", value: "MONTHLY" },
        { label: "분기별", value: "QUARTERLY" },
        { label: "연별", value: "YEARLY" },
      ],
    },
    {
      key: "selectedAutoRenewal",
      label: "자동갱신",
      description: "전체",
      type: "select",
      options: [
        { label: "ON", value: "true" },
        { label: "OFF", value: "false" },
      ],
    },
  ];

  const filterValues = {
    globalFilter,
    selectedStatus,
    selectedBillingCycle,
    selectedAutoRenewal,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    // Handle both string and string[] cases (for multi-select support)
    const stringValue = Array.isArray(value) ? value[0] : value;
    const handlers: Record<string, (val: string) => void> = {
      globalFilter: setGlobalFilter,
      selectedStatus: (val) => setSelectedStatus(val as any),
      selectedBillingCycle: (val) => setSelectedBillingCycle(val as any),
      selectedAutoRenewal: setSelectedAutoRenewal,
    };
    handlers[key]?.(stringValue);
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
