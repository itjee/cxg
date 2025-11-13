'use client';

import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { DataTable } from './data-table';
import { Pagination } from '@/components/pagination';

interface DataTableWithPaginationProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  emptyMessage?: string;
}

/**
 * DataTable + Pagination을 조합한 컴포넌트
 * 모든 상태를 로컬로 관리하며, DataTable과 Pagination 공통 컴포넌트 사용
 */
export function DataTableWithPagination<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  emptyMessage = '데이터가 없습니다.',
}: DataTableWithPaginationProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(pageSize);

  // 필터링된 데이터
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((item) => {
      const itemStr = JSON.stringify(item).toLowerCase();
      return itemStr.includes(globalFilter.toLowerCase());
    });
  }, [data, globalFilter]);

  // 페이지네이션된 데이터
  const paginatedData = React.useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0); // 페이지당 항목 수가 변경되면 첫 페이지로 이동
  };

  return (
    <div className="space-y-4">
      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={paginatedData}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        emptyMessage={emptyMessage}
      />

      {/* 페이지네이션 */}
      <Pagination
        totalItems={filteredData.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={[10, 20, 30, 40, 50]}
        showInfo={true}
      />
    </div>
  );
}
