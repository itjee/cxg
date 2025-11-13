"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useCodeGroupStore } from "../stores";

interface CodeGroupsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * CodeGroups 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useCodeGroupStore와 연동
 */
export function CodeGroupsList<T>({ columns, data }: CodeGroupsListProps<T>) {
  const { searchQuery, setSearchQuery } = useCodeGroupStore();

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
