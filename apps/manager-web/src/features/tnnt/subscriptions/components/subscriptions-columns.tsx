"use client";

/**
 * @file subscriptions-columns.tsx
 * @description 구독 테이블 컬럼 정의
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, DollarSign, Users, HardDrive, Activity } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Subscription, SubscriptionStatus, BillingCycle } from "../types/subscriptions.types";

/**
 * 상수 정의 - 상태별 색상 및 라벨
 */
const statusColors: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  SUSPENDED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  CANCELED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const statusLabels: Record<SubscriptionStatus, string> = {
  ACTIVE: "활성",
  SUSPENDED: "일시중단",
  EXPIRED: "만료",
  CANCELED: "해지",
};

const billingCycleLabels: Record<BillingCycle, string> = {
  MONTHLY: "월별",
  QUARTERLY: "분기별",
  YEARLY: "연별",
};

/**
 * 포맷 함수
 */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '-';
  }
};

const formatCurrency = (amount: number, currency: string = 'KRW') => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getSubscriptionsColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Subscription>[] => [
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
  // 테넌트 ID (축약)
  {
    accessorKey: "tenant_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트" />
    ),
    cell: ({ row }) => {
      const tenantId = row.getValue("tenant_id") as string;
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono" title={tenantId}>
          {tenantId.slice(0, 8)}...
        </code>
      );
    },
  },
  // 구독 계획 ID (축약)
  {
    accessorKey: "plan_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="플랜" />
    ),
    cell: ({ row }) => {
      const planId = row.getValue("plan_id") as string;
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono" title={planId}>
          {planId.slice(0, 8)}...
        </code>
      );
    },
  },
  // 청구 주기
  {
    accessorKey: "billing_cycle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="청구 주기" />
    ),
    cell: ({ row }) => {
      const cycle = row.getValue("billing_cycle") as BillingCycle;
      return (
        <Badge variant="outline">
          {billingCycleLabels[cycle]}
        </Badge>
      );
    },
    size: 100,
  },
  // 상태
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as SubscriptionStatus;
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    size: 100,
  },
  // 기본 요금
  {
    accessorKey: "base_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="기본 요금" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("base_amount") as number;
      const currency = row.original.currency;
      return (
        <div className="flex items-center gap-1 text-sm font-medium">
          <DollarSign className="h-3 w-3" />
          {formatCurrency(amount, currency)}
        </div>
      );
    },
  },
  // 사용량 제한
  {
    id: "limits",
    header: "사용량 제한",
    cell: ({ row }) => {
      const maxUsers = row.original.max_users;
      const maxStorage = row.original.max_storage;
      const maxApiCalls = row.original.max_api_calls;
      
      return (
        <div className="text-xs space-y-1">
          {maxUsers && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{maxUsers}명</span>
            </div>
          )}
          {maxStorage && (
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>{maxStorage}GB</span>
            </div>
          )}
          {maxApiCalls && (
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>{(maxApiCalls / 1000).toFixed(0)}K</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
    size: 120,
  },
  // 시작일
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시작일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {formatDate(row.getValue("start_date"))}
      </div>
    ),
  },
  // 종료일
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
  // 자동 갱신
  {
    accessorKey: "auto_renewal",
    header: "자동 갱신",
    cell: ({ row }) => {
      const autoRenewal = row.getValue("auto_renewal") as boolean;
      return autoRenewal ? (
        <Badge variant="outline" className="bg-green-50 text-green-800">
          ON
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-gray-50 text-gray-800">
          OFF
        </Badge>
      );
    },
    size: 100,
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
