'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePartnerManagersStore } from '../stores';

interface PartnerManagersTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function PartnerManagersTable<T>({ columns, data }: PartnerManagersTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePartnerManagersStore();

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
