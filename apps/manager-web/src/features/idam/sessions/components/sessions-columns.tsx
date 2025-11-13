"use client";

/**
 * @file sessions-columns.tsx
 * @description 세션 테이블 컬럼 정의
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ban, Trash2, Shield, CheckCircle } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Session, SessionStatus, SessionType } from "../types";

/**
 * 상수 정의 - 상태별 색상
 */
const statusColors: Record<SessionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  EXPIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  REVOKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

const statusLabels: Record<SessionStatus, string> = {
  ACTIVE: "활성",
  EXPIRED: "만료됨",
  REVOKED: "취소됨",
} as const;

const sessionTypeLabels: Record<SessionType, string> = {
  WEB: "웹",
  API: "API",
  MOBILE: "모바일",
} as const;

const sessionTypeColors: Record<SessionType, string> = {
  WEB: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  API: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  MOBILE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
} as const;

/**
 * 포맷 함수
 */
const formatStatus = (status: SessionStatus) => statusLabels[status];
const getStatusColor = (status: SessionStatus) => statusColors[status];
const formatSessionType = (type: SessionType) => sessionTypeLabels[type];
const getSessionTypeColor = (type: SessionType) => sessionTypeColors[type];

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

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onRevoke?: (session: Session) => void;
  onDelete?: (session: Session) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getSessionsColumns = ({
  onRevoke,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Session>[] => [
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
  // 세션 ID (짧게)
  {
    accessorKey: "session_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="세션 ID" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {(row.getValue("session_id") as string).slice(0, 16)}...
      </code>
    ),
  },
  // 사용자 ID (짧게)
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자 ID" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs font-mono">
        {(row.getValue("user_id") as string).slice(0, 8)}...
      </div>
    ),
  },
  // 세션 타입
  {
    accessorKey: "session_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="타입" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("session_type") as SessionType;
      return (
        <Badge variant="outline" className={getSessionTypeColor(type)}>
          {formatSessionType(type)}
        </Badge>
      );
    },
  },
  // IP 주소
  {
    accessorKey: "ip_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP 주소" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("ip_address")}</div>
    ),
  },
  // 위치
  {
    id: "location",
    header: "위치",
    cell: ({ row }) => {
      const city = row.original.city;
      const countryCode = row.original.country_code;
      if (!city && !countryCode) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="text-sm">
          {city && countryCode ? `${city}, ${countryCode}` : city || countryCode}
        </div>
      );
    },
  },
  // User Agent (축약)
  {
    accessorKey: "user_agent",
    header: "User Agent",
    cell: ({ row }) => {
      const userAgent = row.getValue("user_agent") as string | undefined;
      if (!userAgent) return <span className="text-muted-foreground">-</span>;
      const truncated = userAgent.length > 30 ? userAgent.slice(0, 30) + "..." : userAgent;
      return (
        <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={userAgent}>
          {truncated}
        </div>
      );
    },
  },
  // MFA 인증
  {
    accessorKey: "mfa_verified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MFA" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("mfa_verified") as boolean;
      return verified ? (
        <Shield className="h-4 w-4 text-green-600" />
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  // 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as SessionStatus;
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  // 마지막 활동
  {
    accessorKey: "last_activity_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 활동" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDateTime(row.getValue("last_activity_at"))}
      </div>
    ),
  },
  // 만료일
  {
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="만료일" />
    ),
    cell: ({ row }) => {
      const expiresAt = row.getValue("expires_at") as string;
      const isExpired = new Date(expiresAt) < new Date();
      return (
        <div className={isExpired ? "text-destructive" : "text-muted-foreground"}>
          {formatDateTime(expiresAt)}
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
      <div className="text-muted-foreground">
        {formatDate(row.getValue("created_at"))}
      </div>
    ),
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const session = row.original;
      const isActive = session.status === "ACTIVE";
      
      return (
        <div className="flex justify-end gap-2">
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRevoke?.(session)}
              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
              title="세션 취소"
            >
              <Ban className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(session)}
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
