'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useTaxInvoicesStore } from '../stores';

interface TaxInvoicesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function TaxInvoicesList<T>({
  columns,
  data,
}: TaxInvoicesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useTaxInvoicesStore();

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
