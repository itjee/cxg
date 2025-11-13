'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useContractsStore } from '../stores';

interface ContractsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function ContractsTable<T>({ columns, data }: ContractsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useContractsStore();

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
