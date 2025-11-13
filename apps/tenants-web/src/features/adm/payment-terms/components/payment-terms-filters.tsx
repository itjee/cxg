"use client";

import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { usePaymentTermStore } from "../stores/payment-term.store";
import type { PaymentTerm } from "../types/payment-term.types";

interface PaymentTermsFiltersProps {
  paymentTerms: PaymentTerm[];
}

/**
 * PaymentTerms 페이지 필터 컴포넌트
 * 공통 Filters 컴포넌트를 래핑하여 usePaymentTermStore와 연동
 */
export function PaymentTermsFilters({ paymentTerms }: PaymentTermsFiltersProps) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = usePaymentTermStore();

  // 필터 설정
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: "searchQuery",
        label: "검색",
        description: "코드, 이름, 설명...",
        type: "search",
      },
      {
        key: "statusFilter",
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
    searchQuery,
    statusFilter,
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    switch (key) {
      case "searchQuery":
        setSearchQuery(value as string);
        break;
      case "statusFilter":
        setStatusFilter(value as "all" | "active" | "inactive");
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
