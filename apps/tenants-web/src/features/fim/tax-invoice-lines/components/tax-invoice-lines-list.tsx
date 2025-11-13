'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useTaxInvoiceLinesStore } from '../stores';

interface TaxInvoiceLinesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function TaxInvoiceLinesList<T>({
  columns,
  data,
}: TaxInvoiceLinesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useTaxInvoiceLinesStore();

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
