'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useAccountsReceivableStore } from '../stores';

interface AccountsReceivableListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function AccountsReceivableList<T>({
  columns,
  data,
}: AccountsReceivableListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useAccountsReceivableStore();

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
