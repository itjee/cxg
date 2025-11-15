"use client";

/**
 * @file transaction-columns.tsx
 * @description 거래 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의 및 포맷 유틸리티
 * - 거래 번호, 결제 수단, 거래 유형, 금액, 상태
 * - 결제 게이트웨이, 처리 시간 정보
 * - 상태별 색상 코딩
 */

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Transaction, TransactionStatus } from "../types";

/**
 * 날짜/시간 포맷 유틸리티 함수
 *
 * @param dateString - ISO 8601 날짜 문자열
 * @returns YYYY-MM-DD HH:MM 형식의 날짜 문자열
 */
const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 통화 포맷 유틸리티 함수
 *
 * @param amount - 금액
 * @returns USD 통화 형식 문자열
 */
const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount);
};

/**
 * 거래 상태별 색상 매핑
 */
const statusColors: Record<TransactionStatus, string> = {
  SUCCESS: "bg-[rgba(115,191,105,0.2)] text-chart-1",
  PENDING: "bg-[rgba(255,152,48,0.2)] text-chart-3",
  FAILED: "bg-[rgba(239,68,68,0.2)] text-chart-4",
  CANCELED: "bg-[rgba(158,167,180,0.2)] text-muted-foreground",
};

/**
 * 거래 상태별 라벨 매핑
 */
const statusLabels: Record<TransactionStatus, string> = {
  SUCCESS: "성공",
  PENDING: "대기 중",
  FAILED: "실패",
  CANCELED: "취소됨",
};

/**
 * 거래 유형별 라벨 매핑
 */
const transactionTypeLabels: Record<string, string> = {
  PAYMENT: "결제",
  REFUND: "환불",
  CHARGEBACK: "차지백",
};

/**
 * 컬럼 정의 생성 파라미터
 */
interface GetColumnsParams {
  /** 거래 상세 보기 핸들러 */
  onViewDetails?: (transaction: Transaction) => void;
}

/**
 * 거래 테이블 컬럼 정의 생성 함수
 *
 * @description
 * TanStack Table에 사용할 거래 컬럼 정의 배열을 생성합니다.
 * - 정렬 가능한 컬럼 (거래 번호, 금액, 상태, 처리 시간)
 * - 행 번호 자동 계산 (페이지네이션 고려)
 * - 상태별 색상 배지
 * - 액션 메뉴 (상세 보기)
 *
 * @param params - 컬럼 정의 파라미터
 * @returns TanStack Table 컬럼 정의 배열
 */
export const getTransactionColumns = ({
  onViewDetails,
}: GetColumnsParams = {}): ColumnDef<Transaction>[] => [
  // NO 컬럼: 페이지네이션을 고려한 행 번호
  {
    id: "rowNumber",
    header: () => (
      <div className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
        NO
      </div>
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const rowIndex = row.index;
      return (
        <div className="text-center text-sm text-foreground w-12">
          {pageIndex * pageSize + rowIndex + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // 거래 번호 컬럼 (정렬 가능)
  {
    accessorKey: "transaction_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="거래 번호" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("transaction_no")}
      </code>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  // 거래 유형 컬럼
  {
    accessorKey: "transaction_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("transaction_type") as string;
      return <div>{transactionTypeLabels[type] || type}</div>;
    },
    enableSorting: true,
  },
  // 결제 수단 컬럼
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결제 수단" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("payment_method")}</div>
    ),
    enableSorting: false,
  },
  // 결제 게이트웨이 컬럼
  {
    accessorKey: "payment_gateway",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="게이트웨이" />
    ),
    cell: ({ row }) => {
      const gateway = row.getValue("payment_gateway") as string | null;
      return <div className="text-sm">{gateway ? gateway : "-"}</div>;
    },
    enableSorting: true,
  },
  // 금액 컬럼 (정렬 가능)
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="금액" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
    enableSorting: true,
  },
  // 상태 컬럼 (정렬 가능, 배지 스타일)
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TransactionStatus;
      return (
        <Badge variant="secondary" className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    enableSorting: true,
  },
  // 처리 시간 컬럼 (정렬 가능)
  {
    accessorKey: "processed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="처리 시간" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDateTime(row.getValue("processed_at"))}
      </div>
    ),
    enableSorting: true,
  },
  // 액션 컬럼: 드롭다운 메뉴 (상세 보기)
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <TooltipProvider>
          <div className="flex items-center justify-end gap-1">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>더보기</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails?.(transaction)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>상세 보기</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      );
    },
    enableHiding: false,
  },
];
