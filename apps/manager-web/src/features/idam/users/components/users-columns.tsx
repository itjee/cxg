"use client";

/**
 * @file users-columns.tsx
 * @description 사용자 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 포맷 함수 (상태, 날짜, SSO, MFA)
 * - 컬럼 정의 (NO, 사용자명, 이메일, MFA, 상태, 마지막로그인, 생성일, 작업)
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Lock, Unlock, Shield } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import {
  formatRelativeTime,
  formatAbsoluteTime,
  formatStatus,
  getStatusColor,
  formatMfaStatus,
  getMfaStatusColor,
  getSsoProviderInfo,
  statusLabels,
  statusColors,
} from "../utils/formatters";
import type { User } from "../types/users.types";

// 기존 statusColors, statusLabels, formatStatus, getStatusColor는 utils/formatters.ts에서 import

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
    meta: {
      filterable: false,
    },
  },

  // 사용자명
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용자명" />
    ),
    cell: ({ row }) => (
      <div className="font-light">{row.getValue("fullName")}</div>
    ),
    meta: {
      filterable: true,
    },
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
    meta: {
      filterable: true,
    },
  },

  // MFA 상태
  {
    accessorKey: "mfaEnabled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MFA" />
    ),
    cell: ({ row }) => {
      const mfaEnabled = row.getValue("mfaEnabled") as boolean;
      return (
        <div className="flex items-center gap-1">
          {mfaEnabled ? (
            <>
              <Shield className="h-4 w-4 text-green-600" />
              <Badge
                variant="outline"
                className={getMfaStatusColor(mfaEnabled)}
              >
                {formatMfaStatus(mfaEnabled)}
              </Badge>
            </>
          ) : (
            <Badge variant="outline" className={getMfaStatusColor(mfaEnabled)}>
              {formatMfaStatus(mfaEnabled)}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      filterable: false,
    },
  },

  // 계정 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="계정상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const failedAttempts = row.original.failedLoginAttempts;
      const lockedUntil = row.original.lockedUntil;

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(status)}>
            {formatStatus(status)}
          </Badge>

          {/* 로그인 실패 표시 */}
          {failedAttempts > 0 && status !== "LOCKED" && (
            <span
              className="text-orange-600"
              title={`실패 횟수: ${failedAttempts}`}
            >
              ⚠️ {failedAttempts}회
            </span>
          )}

          {/* 계정 잠금 표시 */}
          {status === "LOCKED" && (
            <span
              className="text-red-600"
              title={`잠금 해제 예정: ${formatAbsoluteTime(lockedUntil)}`}
            >
              🔒 잠김
            </span>
          )}
        </div>
      );
    },
    meta: {
      filterable: false,
    },
  },

  // 마지막 로그인
  {
    accessorKey: "lastLoginAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막로그인" />
    ),
    cell: ({ row }) => {
      const lastLoginAt = row.getValue("lastLoginAt") as string | null;
      const lastLoginIp = row.original.lastLoginIp;

      if (!lastLoginAt) {
        return (
          <div className="text-muted-foreground text-center">로그인 없음</div>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-center">
          <div className="font-light">{formatRelativeTime(lastLoginAt)}</div>
          {lastLoginIp && (
            <div className="text-muted-foreground" title={`IP: ${lastLoginIp}`}>
              {lastLoginIp}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 로그인 실패 횟수
  {
    accessorKey: "failedLoginAttempts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="실패횟수" />
    ),
    cell: ({ row }) => {
      const attempts = row.getValue("failedLoginAttempts") as number;
      const locked = row.original.status === "LOCKED";

      return (
        <div className="flex items-center gap-2 justify-end">
          {locked ? (
            <Lock className="h-4 w-4 text-red-600" />
          ) : attempts > 0 ? (
            <Unlock className="h-4 w-4 text-orange-600" />
          ) : null}
          <span
            className={
              attempts > 0
                ? "text-orange-600 font-light"
                : "text-muted-foreground"
            }
          >
            {attempts}회
          </span>
        </div>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 생성일시
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="font-light">{formatRelativeTime(createdAt)}</div>
          <div className="text-muted-foreground">
            {formatAbsoluteTime(createdAt, false)}
          </div>
        </div>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 비밀번호 변경 필요
  {
    accessorKey: "forcePasswordChange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="비밀번호" />
    ),
    cell: ({ row }) => {
      const forceChange = row.getValue("forcePasswordChange") as boolean;

      if (!forceChange) {
        return <div className="text-muted-foreground text-center">정상</div>;
      }

      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-center"
        >
          ⚠️ 변경필요
        </Badge>
      );
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
          title="편집"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(row.original)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          title="삭제"
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
