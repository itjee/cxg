'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 페이지 번호 생성 함수
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 5; // 최대 표시할 페이지 번호 개수

  if (totalPages <= maxVisible + 2) {
    // 페이지가 적으면 모두 표시
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 페이지가 많으면 현재 페이지 주변만 표시
    pages.push(0); // 첫 페이지는 항상 표시

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);

    // 현재 페이지가 앞쪽에 있을 때
    if (currentPage <= 2) {
      start = 1;
      end = Math.min(totalPages - 2, maxVisible - 1);
    }

    // 현재 페이지가 뒷쪽에 있을 때
    if (currentPage >= totalPages - 3) {
      start = Math.max(1, totalPages - maxVisible);
      end = totalPages - 2;
    }

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages - 1); // 마지막 페이지는 항상 표시
  }

  return pages;
}

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnVisibility?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  useCollapsibleFilter?: boolean;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = '검색...',
  showColumnVisibility = true,
  showPagination = true,
  pageSize = 10,
  useCollapsibleFilter = true,
  filters = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterExpanded, setFilterExpanded] = React.useState(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="flex flex-col">
      {/* Filter Section */}
      {(searchKey || filters.length > 0) && useCollapsibleFilter && (
        <div className="space-y-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          {/* 필터 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">검색필터</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
            </div>
            <button
              onClick={() => setFilterExpanded(!filterExpanded)}
              className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={filterExpanded ? '필터 숨기기' : '필터 보이기'}
            >
              <ChevronDown
                className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${
                  filterExpanded ? '' : '-rotate-90'
                }`}
              />
            </button>
          </div>

          {/* 필터 컨텐츠 */}
          {filterExpanded && (
            <div className="space-y-3 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Search */}
                {searchKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      검색
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                          table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                )}

                {/* Filters */}
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {filter.label}
                    </label>
                    <Select
                      value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? 'all'}
                      onValueChange={(value) =>
                        table.getColumn(filter.key)?.setFilterValue(value === 'all' ? '' : value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder={`전체 ${filter.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 {filter.label}</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Old Toolbar - shown when useCollapsibleFilter is false */}
      {(searchKey || filters.length > 0) && !useCollapsibleFilter && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            {searchKey && (
              <div className="max-w-sm">
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            )}

            {/* Filters */}
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? 'all'}
                onValueChange={(value) =>
                  table.getColumn(filter.key)?.setFilterValue(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Column Visibility */}
          {showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  컬럼 표시 <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden">
        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider h-12 px-6 py-3 text-left font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-16 font-light px-6 py-4 text-gray-900 dark:text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl opacity-20">📊</div>
                    <p>데이터가 없습니다.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
            전체{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {table.getFilteredRowModel().rows.length}
            </span>
            개 중{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
            개 선택됨
          </div>
          <div className="flex items-center gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">페이지당 행 수</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pagination Buttons */}
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">첫 페이지로</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">이전 페이지</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Number Buttons */}
              {getPageNumbers(table.getState().pagination.pageIndex, table.getPageCount()).map((pageNum, idx) => (
                pageNum === '...' ? (
                  <div key={`ellipsis-${idx}`} className="h-9 w-9 flex items-center justify-center border-y border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">⋯</span>
                  </div>
                ) : (
                  <Button
                    key={pageNum}
                    variant={table.getState().pagination.pageIndex === pageNum ? 'default' : 'outline'}
                    size="icon"
                    className="h-9 w-9 text-sm font-medium"
                    onClick={() => table.setPageIndex(pageNum as number)}
                  >
                    {(pageNum as number) + 1}
                  </Button>
                )
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">다음 페이지</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">마지막 페이지로</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      )}
    </div>
  );
}

// 정렬 가능한 컬럼 헤더 컴포넌트
export function DataTableColumnHeader({
  column,
  title,
}: {
  column: any;
  title: string;
}) {
  if (!column.getCanSort()) {
    return <div className="text-gray-900 dark:text-white">{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span>{title}</span>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
