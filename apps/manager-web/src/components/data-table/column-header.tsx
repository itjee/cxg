"use client";

/**
 * @file data-table-column-header.tsx
 * @description 컬럼 헤더 컴포넌트 (정렬 + 필터 기능)
 *
 * 정렬 아이콘과 필터 메뉴를 포함한 헤더
 */

import { useState } from "react";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  canSort?: boolean;
  canFilter?: boolean;
  filterType?: "text" | "select";
  filterOptions?: Array<{ label: string; value: string }>;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  canSort = true,
  canFilter = true,
  filterType = "text",
  filterOptions = [],
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState(
    (column.getFilterValue() as string) || ""
  );

  const isSorted = column.getIsSorted();
  const hasFilter = column.getFilterValue() !== undefined;

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    column.setFilterValue(filterValue || undefined);
    setFilterOpen(false);
  };

  const handleClearFilter = () => {
    setFilterValue("");
    column.setFilterValue(undefined);
    setFilterOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        {/* 정렬 버튼 */}
        {canSort && column.getCanSort() ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 p-0 hover:bg-accent"
            onClick={() => column.toggleSorting(isSorted === "asc")}
          >
            <span className="text-xs font-medium">{title}</span>
            <div className="ml-2 flex items-center">
              {isSorted === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              )}
            </div>
          </Button>
        ) : (
          <span className="text-xs font-medium">{title}</span>
        )}
      </div>

      {/* 필터 메뉴 */}
      {canFilter && (
        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${hasFilter ? "bg-accent" : ""}`}
            >
              <Filter className={`h-4 w-4 ${hasFilter ? "fill-current" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {/* 필터 입력 */}
            {filterType === "text" ? (
              <div className="p-3 space-y-2">
                <Input
                  placeholder="검색..."
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="h-8 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyFilter();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleApplyFilter}
                    className="h-7 text-xs flex-1"
                  >
                    적용
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFilterOpen(false)}
                    className="h-7 text-xs flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <Select value={filterValue} onValueChange={handleFilterChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">모두</SelectItem>
                    {filterOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleApplyFilter}
                    className="h-7 text-xs flex-1"
                  >
                    적용
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFilterOpen(false)}
                    className="h-7 text-xs flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}

            {/* 필터 초기화 */}
            {hasFilter && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="w-full h-8 text-xs justify-start text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3 mr-2" />
                  필터 초기화
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
