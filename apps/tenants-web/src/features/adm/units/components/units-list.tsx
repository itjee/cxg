'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';

interface UnitsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * Units 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑
 */
export function UnitsList<T>({
  columns,
  data,
}: UnitsListProps<T>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="데이터가 없습니다."
    />
  );
}
