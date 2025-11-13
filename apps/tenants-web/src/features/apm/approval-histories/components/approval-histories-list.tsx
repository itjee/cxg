'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useApprovalHistoriesStore } from '../stores';

interface ApprovalHistoriesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function ApprovalHistoriesList<T>({
  columns,
  data,
}: ApprovalHistoriesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useApprovalHistoriesStore();

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
