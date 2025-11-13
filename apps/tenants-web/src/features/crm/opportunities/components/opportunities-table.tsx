'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useOpportunityStore } from '../stores';

interface OpportunitiesTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Opportunities 페이지 데이터 테이블 컴포넌트
 * 공통 DataTable을 래핑하여 useOpportunityStore와 연동
 */
export function OpportunitiesTable<T>({
  columns,
  data,
}: OpportunitiesTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useOpportunityStore();

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
