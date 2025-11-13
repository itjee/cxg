'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePartnerStore } from '../stores';

interface PartnersTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Partners 페이지 데이터 테이블 컴포넌트
 * 공통 DataTable을 래핑하여 usePartnerStore와 연동
 */
export function PartnersTable<T>({
  columns,
  data,
}: PartnersTableProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePartnerStore();

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
