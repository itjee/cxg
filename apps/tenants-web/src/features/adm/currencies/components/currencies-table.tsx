"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useCurrencyStore } from "../stores";

interface CurrenciesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Currencies 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useCurrencyStore와 연동
 */
export function CurrenciesList<T>({ columns, data }: CurrenciesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCurrencyStore();

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      onSortingChange={setSorting}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      emptyMessage="데이터가 없습니다."
    />
  );
}
