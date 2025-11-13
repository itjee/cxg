'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCampaignsStore } from '../stores';

interface CampaignsTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CampaignsTable<T>({ columns, data }: CampaignsTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCampaignsStore();

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
