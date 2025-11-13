'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useActivityStore } from '../stores';

interface ActivitiesTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Activities 페이지 데이터 테이블 컴포넌트
 * 공통 DataTable을 래핑하여 useActivityStore와 연동
 */
export function ActivitiesTable<T>({
  columns,
  data,
}: ActivitiesTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useActivityStore();

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
