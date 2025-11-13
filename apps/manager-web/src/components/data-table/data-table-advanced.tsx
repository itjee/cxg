"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push("...");
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

export function DataTableAdvanced<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "검색...",
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
    <div className="space-y-4">
      {/* Filter Section */}
      {(searchKey || filters.length > 0) && useCollapsibleFilter && (
        <div>
          {/* 필터 헤더 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-foreground">검색필터</span>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>
            <button
              onClick={() => setFilterExpanded(!filterExpanded)}
              className="ml-4 p-1 hover:bg-accent rounded-md transition-colors"
              title={filterExpanded ? "필터 숨기기" : "필터 보이기"}
            >
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  filterExpanded ? "" : "-rotate-90"
                }`}
              />
            </button>
          </div>

          {/* 필터 컨텐츠 */}
          {filterExpanded && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                {searchKey && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      검색
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                          table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-10 bg-background border-input"
                      />
                    </div>
                  </div>
                )}

                {/* Filters */}
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {filter.label}
                    </label>
                    <select
                      value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? "all"}
                      onChange={(e) =>
                        table.getColumn(filter.key)?.setFilterValue(e.target.value === "all" ? "" : e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
                    >
                      <option value="all">전체 {filter.label}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-muted-foreground text-xs uppercase tracking-wider h-12">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-accent/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-16 font-light">
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
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            전체{" "}
            <span className="font-medium text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>
            개 중{" "}
            <span className="font-medium text-foreground">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
            개 선택됨
          </div>
          <div className="flex items-center gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">페이지당 행 수</p>
              <select
                value={`${table.getState().pagination.pageSize}`}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </option>
                ))}
              </select>
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
                pageNum === "..." ? (
                  <div key={`ellipsis-${idx}`} className="h-9 w-9 flex items-center justify-center border-y border-r border-input bg-background">
                    <span className="text-muted-foreground text-sm">⋯</span>
                  </div>
                ) : (
                  <Button
                    key={pageNum}
                    variant={table.getState().pagination.pageIndex === pageNum ? "default" : "outline"}
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
    return <div>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
