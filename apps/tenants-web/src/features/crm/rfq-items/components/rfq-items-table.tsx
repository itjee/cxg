'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useRfqItemsStore } from '../stores';

interface RfqItemsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function RfqItemsTable<T>({ columns, data }: RfqItemsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useRfqItemsStore();

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
