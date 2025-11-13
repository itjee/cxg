'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePaymentTransactionsStore } from '../stores';

interface PaymentTransactionsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function PaymentTransactionsList<T>({
  columns,
  data,
}: PaymentTransactionsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePaymentTransactionsStore();

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
