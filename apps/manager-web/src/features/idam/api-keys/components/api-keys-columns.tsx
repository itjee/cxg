"use client";

/**
 * @file api-keys-columns.tsx
 * @description API 키 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 날짜 포맷 함수
 * - 컬럼 정의 (NO, 키 ID, 키 이름, 사용자, 상태, 사용 통계, 만료일, 액션)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { ApiKey, ApiKeyStatus } from "../types/api_keys.types";

/**
 * 상수 정의 - 상태별 색상
 */
const statusColors: Record<ApiKeyStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  REVOKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

const statusLabels: Record<ApiKeyStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  REVOKED: "취소됨",
} as const;

/**
 * 포맷 함수 - 상태 포맷
 */
const formatStatus = (status: ApiKeyStatus) => {
  return statusLabels[status];
};

const getStatusColor = (status: ApiKeyStatus) => {
  return statusColors[status];
};

/**
 * 포맷 함수 - 날짜 포맷
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * 포맷 함수 - 날짜시간 포맷
 */
const formatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 포맷 함수 - 숫자 포맷 (천 단위 콤마)
 */
const formatNumber = (num: number) => {
  return num.toLocaleString("ko-KR");
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onEdit?: (apiKey: ApiKey) => void;
  onDelete?: (apiKey: ApiKey) => void;
  onToggleStatus?: (apiKey: ApiKey) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getApiKeysColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
}: GetColumnsParams = {}): ColumnDef<ApiKey>[] => [
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
  // 키 ID
  {
    accessorKey: "keyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="키 ID" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("keyId")}
      </code>
    ),
  },
  // 키 이름
  {
    accessorKey: "keyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="키 이름" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("keyName")}</div>
    ),
  },
  // 사용자 ID
  {
    accessorKey: "userId",
    header: "사용자 ID",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs font-mono">
        {(row.getValue("userId") as string).slice(0, 8)}...
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
      const status = row.getValue("status") as ApiKeyStatus;
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  // 사용 횟수
  {
    accessorKey: "usageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용 횟수" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatNumber(row.getValue("usageCount"))}
      </div>
    ),
  },
  // 마지막 사용일
  {
    accessorKey: "lastUsedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 사용" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDateTime(row.getValue("lastUsedAt"))}
      </div>
    ),
  },
  // 만료일
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="만료일" />
    ),
    cell: ({ row }) => {
      const expiresAt = row.getValue("expiresAt") as string | undefined;
      const isExpired = expiresAt && new Date(expiresAt) < new Date();
      return (
        <div
          className={isExpired ? "text-destructive" : "text-muted-foreground"}
        >
          {formatDate(expiresAt)}
        </div>
      );
    },
  },
  // 등록일
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const apiKey = row.original;
      const isActive = apiKey.status === "ACTIVE";

      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus?.(apiKey)}
            className="h-8 w-8 p-0"
            title={isActive ? "비활성화" : "활성화"}
          >
            {isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(apiKey)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(apiKey)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
