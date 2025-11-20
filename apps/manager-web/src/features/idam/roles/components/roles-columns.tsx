"use client";

/**
 * @file roles-columns.tsx
 * @description 역할 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 포맷 함수 (상태 포맷, 날짜 포맷)
 * - 컬럼 정의 (NO, 역할명, 카테고리, 레벨, 상태, 생성일, 수정일, 액션)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Role } from "../types/roles.types";

/**
 * 유틸리티 함수
 */
const formatDate = (date: string | undefined) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

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
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getRolesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Role>[] => [
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
    meta: {
      filterable: false,
    },
  },
  // 역할명
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="역할명" />
    ),
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("name")}</div>
    ),
    meta: {
      filterable: true,
    },
  },
  // 카테고리
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="카테고리" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryLabels: Record<string, string> = {
        MANAGER_ADMIN: "운영자",
        PLATFORM_SUPPORT: "플랫폼지원",
        TENANT_ADMIN: "테넌트관리자",
        TENANT_USER: "테넌트사용자",
      };
      return (
        <Badge variant="outline">
          {categoryLabels[category] || category}
        </Badge>
      );
    },
    meta: {
      filterable: true,
    },
  },
  // 레벨
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="레벨" />
    ),
    cell: ({ row }) => {
      const level = row.getValue("level") as number;
      const levelColor =
        level <= 10
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          : level <= 50
          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
          : level <= 100
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      return (
        <Badge className={levelColor} variant="outline">
          Level {level}
        </Badge>
      );
    },
    meta: {
      filterable: false,
    },
  },
  // 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === "ACTIVE";
      return (
        <Badge variant="outline" className={getStatusColor(isActive)}>
          {formatStatus(isActive)}
        </Badge>
      );
    },
    meta: {
      filterable: false,
    },
  },
  // 생성일
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div className="text-sm text-muted-foreground">{formatDate(date)}</div>;
    },
    meta: {
      filterable: false,
    },
  },
  // 수정일
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="수정일" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      return <div className="text-sm text-muted-foreground">{formatDate(date)}</div>;
    },
    meta: {
      filterable: false,
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
    meta: {
      filterable: false,
    },
  },
];
