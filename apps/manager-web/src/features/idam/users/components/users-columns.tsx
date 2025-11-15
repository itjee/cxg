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
import { DataTableColumnHeader } from "@/components/data-table";
import type { User } from "../types/users.types";

/**
 * 상수 정의 - 상태별 색상
 */
const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  LOCKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

const statusLabels = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  LOCKED: "잠금",
} as const;

/**
 * 포맷 함수 - 상태 포맷
 */
const formatStatus = (status: string) => {
  return statusLabels[status as keyof typeof statusLabels] || status;
};

const getStatusColor = (status: string) => {
  return statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE;
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getUsersColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<User>[] => [
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullName")}</div>
    ),
  },
  // 이메일
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이메일" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("email") || "-"}
      </div>
    ),
  },
  // 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {formatStatus(status)}
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
