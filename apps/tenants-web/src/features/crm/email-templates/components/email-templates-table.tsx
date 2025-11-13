'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useEmailTemplatesStore } from '../stores';

interface EmailTemplatesTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function EmailTemplatesTable<T>({ columns, data }: EmailTemplatesTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useEmailTemplatesStore();

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
