'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useLeadsStore } from '../stores';

interface LeadsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function LeadsTable<T>({ columns, data }: LeadsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useLeadsStore();

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
