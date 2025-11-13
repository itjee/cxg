'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useJournalEntriesStore } from '../stores';

interface JournalEntriesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function JournalEntriesList<T>({
  columns,
  data,
}: JournalEntriesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useJournalEntriesStore();

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
