"use client";

/**
 * @file users-columns.tsx
 * @description 사용자 테이블 컬럼 정의
 * 
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 포맷 함수 (상태 포맷)
 * - 컬럼 정의 (NO, 사용자명, 설명, 상태, 액션)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Users } from "../types/users.types";

/**
 * 상수 정의 - 상태별 색상
 */
const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
} as const;

const statusLabels = {
  active: "활성",
  inactive: "비활성",
} as const;

/**
 * 포맷 함수 - 상태 포맷
 */
const formatStatus = (isActive: boolean) => {
  return isActive ? statusLabels.active : statusLabels.inactive;
};

const getStatusColor = (isActive: boolean) => {
  return isActive ? statusColors.active : statusColors.inactive;
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onEdit?: (user: Users) => void;
  onDelete?: (user: Users) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getUsersColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Users>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  // 사용자명
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자명" />
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
      <div className="text-muted-foreground">
        {row.getValue("description") || "-"}
      </div>
    ),
  },
  // 상태
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant="outline" className={getStatusColor(isActive)}>
          {formatStatus(isActive)}
        </Badge>
      );
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(row.original)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(row.original)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];
