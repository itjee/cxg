'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCustomerSurveysStore } from '../stores';

interface CustomerSurveysTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CustomerSurveysTable<T>({ columns, data }: CustomerSurveysTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCustomerSurveysStore();

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
