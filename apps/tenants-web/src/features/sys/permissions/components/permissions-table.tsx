'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { usePermissionStore } from '../stores';

interface PermissionsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Permissions 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 usePermissionStore와 연동
 */
export function PermissionsList<T>({
  columns,
  data,
}: PermissionsListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = usePermissionStore();

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
