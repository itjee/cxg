'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePartnerAddressesStore } from '../stores';

interface PartnerAddressesTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function PartnerAddressesTable<T>({ columns, data }: PartnerAddressesTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePartnerAddressesStore();

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
