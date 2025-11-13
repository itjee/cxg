"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useCodeStore } from "../stores/codes.store";

interface CodesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Codes 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useCodesStore와 연동
 */
export function CodesList<T>({ columns, data }: CodesListProps<T>) {
  const { globalFilter, setGlobalFilter } = useCodeStore();

  return (
    <DataTable
      columns={columns}
      data={data}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      emptyMessage="데이터가 없습니다."
    />
  );
}
