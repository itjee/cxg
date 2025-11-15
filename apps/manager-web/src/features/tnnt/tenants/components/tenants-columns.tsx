"use client";

/**
 * @file tenants-columns.tsx
 * @description 테넌트 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태별 색상 및 라벨 매핑 (TRIAL, ACTIVE, SUSPENDED, TERMINATED)
 * - 날짜 포맷 함수
 * - 컬럼 정의 (NO, 테넌트코드, 테넌트명, 타입, 상태, 계약시작일, 등록일, 액션)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Tenant, TenantStatus, TenantType } from "../types";

/**
 * 상수 정의 - 상태별 색상 및 라벨
 */
const statusColors: Record<TenantStatus, string> = {
  TRIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  SUSPENDED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

const statusLabels: Record<TenantStatus, string> = {
  TRIAL: "평가판",
  ACTIVE: "활성",
  SUSPENDED: "일시중단",
  TERMINATED: "종료",
} as const;

const typeLabels: Record<TenantType, string> = {
  TRIAL: "평가판",
  STANDARD: "표준",
  PREMIUM: "프리미엄",
  ENTERPRISE: "엔터프라이즈",
} as const;

const typeColors: Record<TenantType, string> = {
  TRIAL: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  STANDARD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  PREMIUM: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ENTERPRISE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
} as const;

/**
 * 포맷 함수 - 날짜 포맷
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "-";
  }
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onEdit?: (tenant: Tenant) => void;
  onDelete?: (tenant: Tenant) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getTenantsColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Tenant>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center text-sm text-muted-foreground">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 60,
  },
  // 테넌트 코드
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="코드" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("code")}
      </code>
    ),
    size: 100,
  },
  // 테넌트명
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  // 상호 (사업자명)
  {
    accessorKey: "biz_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상호" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("biz_name") || "-"}
      </div>
    ),
  },
  // 테넌트 유형
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as TenantType;
      return (
        <Badge variant="outline" className={typeColors[type]}>
          {typeLabels[type]}
        </Badge>
      );
    },
    size: 110,
  },
  // 테넌트 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TenantStatus;
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    size: 100,
  },
  // 일시중단 상태 (경고 표시)
  {
    id: "suspension",
    header: "일시중단",
    cell: ({ row }) => {
      const isSuspended = row.original.is_suspended;
      const suspendedReason = row.original.suspended_reason;
      return isSuspended ? (
        <div className="flex items-center gap-1 text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-600" title={suspendedReason} />
          <span className="text-yellow-600">예</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">아니오</span>
      );
    },
    size: 80,
  },
  // 계약 시작일
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="계약시작일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("start_date"))}
      </div>
    ),
  },
  // 계약 종료일
  {
    accessorKey: "close_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="종료일" />
    ),
    cell: ({ row }) => {
      const closeDate = row.getValue("close_date") as string | undefined;
      return (
        <div className="text-sm text-muted-foreground">
          {closeDate ? formatDate(closeDate) : <Badge variant="outline">무기한</Badge>}
        </div>
      );
    },
  },
  // 등록일
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("created_at"))}
      </div>
    ),
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            className="h-8 w-8 p-0"
            title="수정"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
    enableSorting: false,
    size: 100,
  },
];
