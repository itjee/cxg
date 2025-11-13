'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCustomerSegmentMembersStore } from '../stores';

interface CustomerSegmentMembersTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CustomerSegmentMembersTable<T>({ columns, data }: CustomerSegmentMembersTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCustomerSegmentMembersStore();

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
