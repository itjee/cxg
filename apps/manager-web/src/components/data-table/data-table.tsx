"use client";

import * as React from "react";
import {
  ColumnDef,
  OnChangeFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination/pagination";

export interface DataTableProps<TData, TValue> {
  /**
   * 컬럼 정의
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * 테이블 데이터
   */
  data: TData[];

  /**
   * 정렬 상태 (store에서 전달)
   */
  sorting?: SortingState;

  /**
   * 정렬 변경 콜백 (TanStack 형식)
   */
  onSortingChange?: OnChangeFn<SortingState>;

  /**
   * 컬럼 표시 여부
   */
  columnVisibility?: VisibilityState;

  /**
   * 컬럼 표시 여부 변경 콜백
   */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  /**
   * 빈 상태 메시지
   */
  emptyMessage?: string;

  /**
   * 커스텀 스타일 클래스
   */
  className?: string;

  /**
   * 페이지네이션 표시 여부
   */
  showPagination?: boolean;

  /**
   * 페이지당 행 수
   */
  pageSize?: number;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting = [],
  onSortingChange,
  columnVisibility = {},
  onColumnVisibilityChange,
  emptyMessage = "데이터가 없습니다.",
  className = "",
  showPagination = false,
  pageSize = 10,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [localPageSize, setLocalPageSize] = React.useState(pageSize);
  const [pageIndex, setPageIndex] = React.useState(0);

  // useCallback을 사용하여 콜백 함수가 매번 새로 생성되지 않도록 함
  const handleSortingChange = React.useCallback(
    (newSorting: any) => {
      if (onSortingChange) {
        onSortingChange(newSorting);
      }
    },
    [onSortingChange]
  );

  const handleColumnVisibilityChange = React.useCallback(
    (newVisibility: any) => {
      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(newVisibility);
      }
    },
    [onColumnVisibilityChange]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize: localPageSize,
      },
    },
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
  });

  return (
    <div className="space-y-4">
      {/* 데이터 테이블 영역 */}
      <div
        className={`rounded-lg border border-border overflow-hidden bg-card shadow-sm ${className}`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider h-10"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-4xl opacity-20">⏳</div>
                      <p>로딩 중...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-1.5 h-8 text-xs font-light"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-4xl opacity-20">📊</div>
                      <p>{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 영역 */}
      {showPagination && (
        <Pagination
          totalItems={table.getRowModel().rows.length}
          currentPage={pageIndex}
          onPageChange={(page) => setPageIndex(page)}
          itemsPerPage={localPageSize}
          onItemsPerPageChange={(size) => {
            setLocalPageSize(size);
            setPageIndex(0);
          }}
          showInfo={true}
        />
      )}
    </div>
  );
}

/**
 * 정렬 기능이 있는 컬럼 헤더 컴포넌트
 */
export interface DataTableColumnHeaderProps {
  column: any;
  title: string;
  canSort?: boolean;
}

export function DataTableColumnHeader({
  column,
  title,
  canSort = true,
}: DataTableColumnHeaderProps) {
  const isSorted = column.getIsSorted();

  return (
    <div className="flex items-center gap-2">
      {/* 정렬 버튼 */}
      {canSort && column.getCanSort() ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 -ml-3 font-medium"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <span>{title}</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <span className="text-sm font-medium">{title}</span>
      )}
    </div>
  );
}
