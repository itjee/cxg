'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useApprovalRequestsStore } from '../stores';

interface ApprovalRequestsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function ApprovalRequestsList<T>({
  columns,
  data,
}: ApprovalRequestsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useApprovalRequestsStore();

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
