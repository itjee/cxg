"use client";

/**
 * @file login-logs-columns.tsx
 * @description 로그인 이력 테이블 컬럼 정의
 */

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  LogOut,
  Lock,
  KeyRound,
} from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { LoginLog, AttemptType, UserType, MfaMethod } from "../types";

/**
 * 상수 정의 - 시도 타입별 색상 및 라벨
 */
const attemptTypeColors: Record<AttemptType, string> = {
  LOGIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  LOGOUT: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  FAILED_LOGIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  LOCKED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  PASSWORD_RESET:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
} as const;

const attemptTypeLabels: Record<AttemptType, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  FAILED_LOGIN: "로그인 실패",
  LOCKED: "계정 잠김",
  PASSWORD_RESET: "비밀번호 재설정",
} as const;

const attemptTypeIcons: Record<AttemptType, any> = {
  LOGIN: CheckCircle,
  LOGOUT: LogOut,
  FAILED_LOGIN: XCircle,
  LOCKED: Lock,
  PASSWORD_RESET: KeyRound,
} as const;

const userTypeLabels: Record<UserType, string> = {
  MASTER: "마스터",
  TENANT: "테넌트",
  SYSTEM: "시스템",
} as const;

const mfaMethodLabels: Record<MfaMethod, string> = {
  TOTP: "TOTP",
  SMS: "SMS",
  EMAIL: "이메일",
} as const;

/**
 * 포맷 함수
 */
const formatAttemptType = (type: AttemptType) => attemptTypeLabels[type];
const getAttemptTypeColor = (type: AttemptType) => attemptTypeColors[type];
const getAttemptTypeIcon = (type: AttemptType) => attemptTypeIcons[type];

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onViewDetail?: (log: LoginLog) => void;
  onDelete?: (log: LoginLog) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getLoginLogsColumns = ({
  onViewDetail,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<LoginLog>[] => [
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
  // 시도 타입
  {
    accessorKey: "attempt_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시도 타입" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("attempt_type") as AttemptType;
      const Icon = getAttemptTypeIcon(type);
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant="outline" className={getAttemptTypeColor(type)}>
            {formatAttemptType(type)}
          </Badge>
        </div>
      );
    },
    meta: {
      filterable: false,
    },
  },
  // 성공 여부
  {
    accessorKey: "success",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결과" />
    ),
    cell: ({ row }) => {
      const success = row.getValue("success") as boolean;
      return success ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>성공</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />
          <span>실패</span>
        </div>
      );
    },
    meta: {
      filterable: false,
    },
  },
  // 사용자명
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자" />
    ),
    cell: ({ row }) => {
      const username = row.getValue("username") as string | undefined;
      return username || <span className="text-muted-foreground">-</span>;
    },
    meta: {
      filterable: true,
    },
  },
  // 사용자 타입
  {
    accessorKey: "user_type",
    header: "타입",
    cell: ({ row }) => {
      const userType = row.getValue("user_type") as UserType | undefined;
      if (!userType) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="secondary">{userTypeLabels[userType]}</Badge>;
    },
    meta: {
      filterable: false,
    },
  },
  // IP 주소
  {
    accessorKey: "ip_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP 주소" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-base">{row.getValue("ip_address")}</div>
    ),
    meta: {
      filterable: true,
    },
  },
  // 위치
  {
    id: "location",
    header: "위치",
    cell: ({ row }) => {
      const city = row.original.city;
      const countryCode = row.original.countryCode;
      if (!city && !countryCode)
        return <span className="text-muted-foreground">-</span>;
      return (
        <div className="text-base">
          {city && countryCode
            ? `${city}, ${countryCode}`
            : city || countryCode}
        </div>
      );
    },
    meta: {
      filterable: true,
    },
  },
  // MFA 사용
  {
    accessorKey: "mfa_used",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MFA" />
    ),
    cell: ({ row }) => {
      const mfaUsed = row.getValue("mfa_used") as boolean;
      const mfaMethod = row.original.mfaMethod;
      if (!mfaUsed) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">
            {mfaMethod ? mfaMethodLabels[mfaMethod] : "Yes"}
          </span>
        </div>
      );
    },
    meta: {
      filterable: false,
    },
  },
  // 실패 사유
  {
    accessorKey: "failure_reason",
    header: "실패 사유",
    cell: ({ row }) => {
      const reason = row.getValue("failure_reason") as string | undefined;
      if (!reason) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge variant="outline" className="bg-red-50 text-red-800">
          {reason}
        </Badge>
      );
    },
    meta: {
      filterable: true,
    },
  },
  // 일시
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="일시" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-base">
        {formatDateTime(row.getValue("created_at"))}
      </div>
    ),
    meta: {
      filterable: false,
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const log = row.original;

      return (
        <div className="flex justify-end gap-2">
          {onViewDetail && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetail(log)}
              className="h-8 w-8 p-0"
              title="상세 보기"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(log)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      filterable: false,
    },
  },
];
