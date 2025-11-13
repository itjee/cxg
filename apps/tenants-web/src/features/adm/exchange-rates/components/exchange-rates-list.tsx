"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useExchangeRatesStore } from "../stores/exchange-rates.store";

interface ExchangeRatesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * ExchangeRates 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useExchangeRatesStore와 연동
 */
export function ExchangeRatesList<T>({ columns, data }: ExchangeRatesListProps<T>) {
  const { searchQuery, setSearchQuery } = useExchangeRatesStore();

  return (
    <DataTable
      columns={columns}
      data={data}
      globalFilter={searchQuery}
      onGlobalFilterChange={setSearchQuery}
      emptyMessage="데이터가 없습니다."
    />
  );
}
