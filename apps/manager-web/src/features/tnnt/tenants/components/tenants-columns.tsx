"use client";

/**
 * @file tenants-columns.tsx
 * @description 테넌트 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의, 포맷 함수, 상수를 포함합니다.
 * - 상태 색상 및 라벨 매핑
 * - 포맷 함수 (날짜, 상태, 유형, 사업자 구분)
 * - 컬럼 정의 (NO, 테넌트명[코드], 상호[사업자번호], 대표자명, 구분, 전화번호, 직원수, 유형, 상태, 일시중단, 시작일, 종료일, 등록일, 작업)
 */

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertCircle, ExternalLink } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import {
  formatRelativeTime,
  formatAbsoluteTime,
  formatPeriodDate,
  formatTenantStatus,
  getTenantStatusColor,
  formatTenantType,
  getTenantTypeColor,
  formatBizType,
  formatSuspendedStatus,
  getSuspendedStatusColor,
} from "../utils/formatters";
import type { Tenant } from "../types/tenants.types";

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

  // 테넌트명 (코드 하단 표시)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트명" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/tnnt/tenant-portal?tenantId=${row.original.id}`}
        className="flex flex-col gap-0.5 hover:underline group"
      >
        <div className="font-light text-blue-600 dark:text-blue-400 group-hover:font-medium transition-all">
          {row.getValue("name")}
        </div>
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground group-hover:bg-muted/80">
          {row.original.code}
        </code>
      </Link>
    ),
    meta: {
      filterable: true,
    },
  },

  // 상호 (사업자명 + 사업자번호)
  {
    accessorKey: "bizName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상호" />
    ),
    cell: ({ row }) => {
      const bizName = row.getValue("bizName") as string | null;
      const bizNo = (row.original.bizNo || row.original.biz_no) as string | undefined;
      return (
        <div className="flex flex-col gap-0.5">
          <div className="text-muted-foreground">{bizName || "-"}</div>
          {bizNo && (
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
              {bizNo}
            </code>
          )}
        </div>
      );
    },
    meta: {
      filterable: true,
    },
  },

  // 대표자명
  {
    accessorKey: "ceoName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="대표자명" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {(row.getValue("ceoName") as string | null) || "-"}
      </div>
    ),
    meta: {
      filterable: true,
    },
  },

  // 사업자 구분
  {
    accessorKey: "bizType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="구분" />
    ),
    cell: ({ row }) => {
      const bizType = row.getValue("bizType") as string | null;
      return (
        <Badge variant="outline">
          {formatBizType(bizType)}
        </Badge>
      );
    },
    meta: {
      filterable: true,
    },
  },

  // 전화번호
  {
    accessorKey: "phoneNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="전화번호" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {(row.getValue("phoneNo") as string | null) || "-"}
      </div>
    ),
    meta: {
      filterable: false,
    },
  },

  // 직원수
  {
    accessorKey: "employeeCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="직원수" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("employeeCount") as number;
      return (
        <div className="text-center text-muted-foreground">
          {count > 0 ? `${count}명` : "-"}
        </div>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 테넌트 유형
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant="outline" className={getTenantTypeColor(type)}>
          {formatTenantType(type)}
        </Badge>
      );
    },
    enableSorting: true,
    meta: {
      filterable: true,
    },
  },

  // 테넌트 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={getTenantStatusColor(status)}>
          {formatTenantStatus(status)}
        </Badge>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 일시중단 여부
  {
    id: "suspension",
    header: "일시중단",
    cell: ({ row }) => {
      const isSuspended = (row.original.isSuspended ?? row.original.is_suspended) as boolean | undefined;
      const suspendedReason = (row.original.suspendedReason || row.original.suspended_reason) as string | undefined;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getSuspendedStatusColor(isSuspended ?? false)}
          >
            {formatSuspendedStatus(isSuspended ?? false)}
          </Badge>

          {/* 일시중단 사유 표시 */}
          {isSuspended && suspendedReason && (
            <span title={`사유: ${suspendedReason}`}>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      filterable: false,
    },
  },

  // 계약 시작일
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시작일" />
    ),
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as string;
      return <div className="text-muted-foreground">{formatPeriodDate(startDate)}</div>;
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 계약 종료일
  {
    accessorKey: "closeDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="종료일" />
    ),
    cell: ({ row }) => {
      const closeDate = row.getValue("closeDate") as string | null;

      if (!closeDate) {
        return (
          <div className="text-center">
            <Badge variant="outline">무기한</Badge>
          </div>
        );
      }

      return (
        <div className="text-muted-foreground">{formatPeriodDate(closeDate)}</div>
      );
    },
    enableSorting: true,
    meta: {
      filterable: false,
    },
  },

  // 등록일
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => {
      const createdAt = (row.getValue("createdAt") || row.original.created_at) as string | undefined;
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
