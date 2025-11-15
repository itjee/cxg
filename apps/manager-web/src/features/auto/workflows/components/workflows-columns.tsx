"use client";

/**
 * @file workflows-columns.tsx
 * @description 워크플로우 테이블 컬럼 정의
 *
 * 역할:
 * - TanStack Table 컬럼 정의
 * - 포맷 함수 (날짜)
 * - 상수 (상태 색상 매핑)
 * - 액션 핸들러 타입
 */

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Workflows } from "../types";

/**
 * 날짜 포맷 함수
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 상태 색상 매핑
 */
const statusConfig = {
  active: { label: "활성", variant: "default" as const },
  inactive: { label: "비활성", variant: "secondary" as const },
};

/**
 * 컬럼 생성 함수 파라미터
 */
interface GetColumnsParams {
  onEdit?: (workflow: Workflows) => void;
  onDelete?: (workflow: Workflows) => void;
  onToggle?: (workflow: Workflows) => void;
}

/**
 * 워크플로우 테이블 컬럼 정의 생성 함수
 */
export const getWorkflowsColumns = ({
  onEdit,
  onDelete,
  onToggle,
}: GetColumnsParams = {}): ColumnDef<Workflows>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center font-medium text-muted-foreground">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 50,
  },
  // 워크플로우명
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="워크플로우명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  // 설명
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-md truncate">
        {row.getValue("description") || "-"}
      </div>
    ),
    enableSorting: false,
  },
  // 상태
  {
    accessorKey: "is_active",
    header: "상태",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      const status = isActive ? statusConfig.active : statusConfig.inactive;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      if (value === "true") return row.getValue(id) === true;
      if (value === "false") return row.getValue(id) === false;
      return true;
    },
  },
  // 마지막 실행
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 실행" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updated_at") as string;
      return <div className="text-sm">{formatDate(updatedAt)}</div>;
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end items-center gap-2">
        {onToggle && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onToggle(row.original)}
            title={row.original.is_active ? "일시정지" : "시작"}
          >
            {row.original.is_active ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
        {onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(row.original)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(row.original)}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
    enableSorting: false,
  },
];
