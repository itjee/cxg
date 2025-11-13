'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useDepartmentsStore } from '../stores';

interface DepartmentsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Departments 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useDepartmentsStore와 연동
 */
export function DepartmentsList<T>({
  columns,
  data,
}: DepartmentsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useDepartmentsStore();

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
