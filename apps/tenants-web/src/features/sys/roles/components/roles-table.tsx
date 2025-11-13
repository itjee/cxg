'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useRoleStore } from '../stores';

interface RolesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Roles 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useRoleStore와 연동
 */
export function RolesList<T>({
  columns,
  data,
}: RolesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useRoleStore();

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
