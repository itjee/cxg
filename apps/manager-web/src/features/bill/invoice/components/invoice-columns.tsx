"use client";

/**
 * @file invoice-columns.tsx
 * @description 청구서 테이블 컬럼 정의
 *
 * TanStack Table 컬럼 정의 및 포맷 유틸리티
 * - 청구서 번호, 테넌트, 발행일, 마감일, 금액, 상태
 * - 상세 보기 및 PDF 다운로드 액션
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
import { Eye, Download, MoreVertical } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Invoice, InvoiceStatus } from "../types/invoice.types";

/**
 * 날짜 포맷 유틸리티 함수
 *
 * @param dateString - ISO 8601 날짜 문자열
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

/**
 * 통화 포맷 유틸리티 함수
 *
 * @param amount - 금액
 * @returns USD 통화 형식 문자열
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * 청구서 상태별 색상 매핑
 */
const statusColors: Record<InvoiceStatus, string> = {
  PAID: "bg-[rgba(115,191,105,0.2)] text-chart-1",
  PENDING: "bg-[rgba(255,152,48,0.2)] text-chart-3",
  OVERDUE: "bg-[rgba(239,68,68,0.2)] text-chart-4",
  CANCELLED: "bg-[rgba(158,167,180,0.2)] text-muted-foreground",
};

/**
 * 청구서 상태별 라벨 매핑
 */
const statusLabels: Record<InvoiceStatus, string> = {
  PAID: "지급 완료",
  PENDING: "미지급",
  OVERDUE: "연체",
  CANCELLED: "취소됨",
};

/**
 * 컬럼 정의 생성 파라미터
 */
interface GetColumnsParams {
  /** 청구서 상세 보기 핸들러 */
  onViewDetails?: (invoice: Invoice) => void;

  /** PDF 다운로드 핸들러 */
  onDownload?: (invoice: Invoice) => void;
}

/**
 * 청구서 테이블 컬럼 정의 생성 함수
 *
 * @description
 * TanStack Table에 사용할 청구서 컬럼 정의 배열을 생성합니다.
 * - 정렬 가능한 컬럼 (청구서 번호, 테넌트, 발행일, 마감일, 금액, 상태)
 * - 행 번호 자동 계산 (페이지네이션 고려)
 * - 상태별 색상 배지
 * - 액션 메뉴 (상세 보기, PDF 다운로드)
 *
 * @param params - 컬럼 정의 파라미터
 * @returns TanStack Table 컬럼 정의 배열
 *
 * @example
 * ```typescript
 * const columns = getInvoiceColumns({
 *   onViewDetails: (invoice) => console.log(invoice),
 *   onDownload: (invoice) => downloadPDF(invoice.id)
 * });
 * ```
 */
export const getInvoiceColumns = ({
  onViewDetails,
  onDownload,
}: GetColumnsParams = {}): ColumnDef<Invoice>[] => [
  // NO 컬럼: 페이지네이션을 고려한 행 번호
  {
    id: "rowNumber",
    header: () => (
      <div className="text-center text-sm font-light text-muted-foreground uppercase tracking-wider">
        NO
      </div>
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const rowIndex = row.index;
      return (
        <div className="text-center text-base text-foreground w-12">
          {pageIndex * pageSize + rowIndex + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // 청구서 번호 컬럼 (정렬 가능)
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="청구서 번호" />
    ),
    cell: ({ row }) => (
      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("invoiceNumber")}
      </code>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  // 테넌트명 컬럼 (정렬 가능)
  {
    accessorKey: "tenantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트" />
    ),
    cell: ({ row }) => <div>{row.getValue("tenantName")}</div>,
    enableSorting: true,
  },
  // 발행일 컬럼 (정렬 가능)
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="발행일" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("issueDate"))}</div>,
    enableSorting: true,
  },
  // 마감일 컬럼 (정렬 가능)
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마감일" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("dueDate"))}</div>,
    enableSorting: true,
  },
  // 금액 컬럼 (정렬 가능)
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="금액" />
    ),
    cell: ({ row }) => <div>{formatCurrency(row.getValue("amount"))}</div>,
    enableSorting: true,
  },
  // 상태 컬럼 (정렬 가능, 배지 스타일)
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as InvoiceStatus;
      return (
        <Badge variant="secondary" className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
    enableSorting: true,
  },
  // 액션 컬럼: 드롭다운 메뉴 (상세 보기, PDF 다운로드)
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const invoice = row.original;

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
                <DropdownMenuItem onClick={() => onViewDetails?.(invoice)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>상세 보기</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload?.(invoice)}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>PDF 다운로드</span>
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
