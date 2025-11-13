'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePartnerBanksStore } from '../stores';

interface PartnerBanksTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function PartnerBanksTable<T>({ columns, data }: PartnerBanksTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePartnerBanksStore();

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
