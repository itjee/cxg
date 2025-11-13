'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useJournalEntryLinesStore } from '../stores';

interface JournalEntryLinesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function JournalEntryLinesList<T>({
  columns,
  data,
}: JournalEntryLinesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useJournalEntryLinesStore();

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
