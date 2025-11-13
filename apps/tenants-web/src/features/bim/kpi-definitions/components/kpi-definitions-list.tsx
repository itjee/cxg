'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useKpiDefinitionsStore } from '../stores';

interface KpiDefinitionsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function KpiDefinitionsList<T>({
  columns,
  data,
}: KpiDefinitionsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useKpiDefinitionsStore();

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
