'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCustomerSegmentsStore } from '../stores';

interface CustomerSegmentsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CustomerSegmentsTable<T>({ columns, data }: CustomerSegmentsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCustomerSegmentsStore();

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
