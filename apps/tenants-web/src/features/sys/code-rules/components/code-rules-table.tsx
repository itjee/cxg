'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useCodeRuleStore } from '../stores';

interface CodeRulesListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * CodeRules 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 useCodeRuleStore와 연동
 */
export function CodeRulesList<T>({
  columns,
  data,
}: CodeRulesListProps<T>) {
  const { sorting, setSorting, globalFilter, setGlobalFilter } = useCodeRuleStore();

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
