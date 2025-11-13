'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useEmployeeStore } from '../stores';

interface EmployeesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Employees 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useEmployeeStore와 연동
 */
export function EmployeesList<T>({
  columns,
  data,
}: EmployeesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useEmployeeStore();

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

