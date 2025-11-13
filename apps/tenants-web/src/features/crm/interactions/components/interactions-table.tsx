'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useInteractionsStore } from '../stores';

interface InteractionsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function InteractionsTable<T>({ columns, data }: InteractionsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useInteractionsStore();

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
