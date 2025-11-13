'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCampaignMembersStore } from '../stores';

interface CampaignMembersTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function CampaignMembersTable<T>({ columns, data }: CampaignMembersTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCampaignMembersStore();

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
