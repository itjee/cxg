'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useAccountsPayableStore } from '../stores';

interface AccountsPayableListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function AccountsPayableList<T>({
  columns,
  data,
}: AccountsPayableListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useAccountsPayableStore();

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
