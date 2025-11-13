'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useSalesTargetsStore } from '../stores';

interface SalesTargetsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function SalesTargetsTable<T>({ columns, data }: SalesTargetsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useSalesTargetsStore();

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
