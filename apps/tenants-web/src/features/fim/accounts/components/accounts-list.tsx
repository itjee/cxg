'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useAccountsStore } from '../stores';

interface AccountsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function AccountsList<T>({
  columns,
  data,
}: AccountsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useAccountsStore();

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
