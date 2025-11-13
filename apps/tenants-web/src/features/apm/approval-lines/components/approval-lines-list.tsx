'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useApprovalLinesStore } from '../stores';

interface ApprovalLinesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function ApprovalLinesList<T>({
  columns,
  data,
}: ApprovalLinesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useApprovalLinesStore();

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
