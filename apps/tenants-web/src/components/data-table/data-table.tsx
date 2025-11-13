'use client';

import {
  ColumnDef,
  OnChangeFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
   * 전역 필터 (검색)
   */
  globalFilter?: string;

  /**
   * 전역 필터 변경 콜백
   */
  onGlobalFilterChange?: OnChangeFn<string>;

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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting = [],
  onSortingChange,
  globalFilter = '',
  onGlobalFilterChange,
  columnVisibility = {},
  onColumnVisibilityChange,
  emptyMessage = '데이터가 없습니다.',
  className = '',
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange,
    onGlobalFilterChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={`rounded-lg border border-border overflow-hidden bg-card shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-accent/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 h-16 font-light">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
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
  );
}
