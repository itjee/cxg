'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useBusinessDocumentsStore } from '../stores';

interface BusinessDocumentsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function BusinessDocumentsList<T>({
  columns,
  data,
}: BusinessDocumentsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useBusinessDocumentsStore();

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
