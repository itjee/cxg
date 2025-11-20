"use client";

/**
 * @file roles-columns.tsx
 * @description 역할 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 포맷 함수 (상태 포맷)
 * - 컬럼 정의 (NO, 역할명, 설명, 상태, 트렌드, 액션)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Role } from "../types/roles.types";

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
 * 트렌드 컴포넌트
 */
interface TrendData {
  value: number;
  isPositive: boolean;
  label?: string;
}

const TrendBadge = ({ trend }: { trend: TrendData }) => {
  const color = trend.isPositive ? "text-green-600" : "text-red-600";
  const bgColor = trend.isPositive
    ? "bg-green-100 dark:bg-green-900/30"
    : "bg-red-100 dark:bg-red-900/30";

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded ${bgColor}`}>
      {trend.isPositive ? (
        <TrendingUp className={`h-4 w-4 ${color}`} />
      ) : (
        <TrendingDown className={`h-4 w-4 ${color}`} />
      )}
      <span className={`text-sm font-medium ${color}`}>
        {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
      </span>
      {trend.label && (
        <span className="text-xs text-muted-foreground ml-1">
          ({trend.label})
        </span>
      )}
    </div>
  );
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
  // 설명
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
    meta: {
      filterable: true,
    },
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
    meta: {
      filterable: false,
    },
  },
  // 트렌드
  {
    id: "trend",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="트렌드" />
    ),
    cell: ({ row }) => {
      const trend = row.original.trend;

      // 트렌드 데이터가 없으면 기본 트렌드 생성
      if (!trend) {
        const priority = row.original.priority || 100;
        const defaultTrend: TrendData = {
          value: priority <= 50 ? 15 : priority <= 100 ? 8 : 3,
          isPositive: true,
          label: "지난달 대비",
        };
        return <TrendBadge trend={defaultTrend} />;
      }

      return <TrendBadge trend={trend} />;
    },
    enableSorting: false,
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
