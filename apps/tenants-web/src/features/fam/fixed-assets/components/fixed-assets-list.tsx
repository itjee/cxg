'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useFixedAssetsStore } from '../stores';

interface FixedAssetsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function FixedAssetsList<T>({
  columns,
  data,
}: FixedAssetsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useFixedAssetsStore();

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
