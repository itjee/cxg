"use client";

/**
 * @file executions-columns.tsx
 * @description 워크플로우 실행 이력 테이블 컬럼 정의
 * 
 * 역할:
 * - TanStack Table 컬럼 정의
 * - 포맷 함수 (날짜, 시간, 리소스)
 * - 상수 (상태 색상 매핑)
 * - 액션 핸들러 타입
 */

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Execution, ExecutionStatus, TriggerSource } from "../types";

/**
 * 날짜/시간 포맷 함수
 */
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * 실행 시간 포맷 함수 (초 -> 분:초)
 */
const formatDuration = (seconds?: number): string => {
  if (!seconds) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;
};

/**
 * 리소스 포맷 함수
 */
const formatResource = (value?: number, unit: string = ""): string => {
  if (!value) return "-";
  return `${value.toFixed(2)}${unit}`;
};

/**
 * 실행 상태 색상 및 라벨 매핑
 */
const statusConfig: Record<ExecutionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "대기", variant: "outline" },
  RUNNING: { label: "실행중", variant: "default" },
  COMPLETED: { label: "완료", variant: "secondary" },
  FAILED: { label: "실패", variant: "destructive" },
  CANCELED: { label: "취소", variant: "outline" },
  TIMEOUT: { label: "타임아웃", variant: "destructive" },
};

/**
 * 트리거 소스 라벨 매핑
 */
const triggerSourceLabels: Record<TriggerSource, string> = {
  SCHEDULED: "스케줄",
  EVENT: "이벤트",
  MANUAL: "수동",
  WEBHOOK: "웹훅",
};

/**
 * 컬럼 생성 함수 파라미터
 */
interface GetColumnsParams {
  onViewDetails?: (execution: Execution) => void;
}

/**
 * 실행 이력 테이블 컬럼 정의 생성 함수
 */
export const getExecutionsColumns = ({
  onViewDetails,
}: GetColumnsParams = {}): ColumnDef<Execution>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center font-medium text-muted-foreground">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 50,
  },
  // 실행 ID
  {
    accessorKey: "execution_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="실행 ID" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("execution_id")}
      </code>
    ),
  },
  // 상태
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue("status") as ExecutionStatus;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    },
  },
  // 트리거 소스
  {
    accessorKey: "trigger_source",
    header: "트리거",
    cell: ({ row }) => {
      const source = row.getValue("trigger_source") as TriggerSource | undefined;
      if (!source) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge variant="outline" className="font-normal">
          {triggerSourceLabels[source]}
        </Badge>
      );
    },
  },
  // 시작 시간
  {
    accessorKey: "started_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시작 시간" />
    ),
    cell: ({ row }) => {
      const startedAt = row.getValue("started_at") as string | undefined;
      return <div className="text-sm">{formatDateTime(startedAt)}</div>;
    },
  },
  // 실행 시간
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="실행 시간" />
    ),
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | undefined;
      return <div className="text-sm">{formatDuration(duration)}</div>;
    },
  },
  // 현재 단계
  {
    accessorKey: "current_step",
    header: "현재 단계",
    cell: ({ row }) => {
      const step = row.getValue("current_step") as string | undefined;
      const status = row.getValue("status") as ExecutionStatus;
      
      if (status === "RUNNING" && step) {
        return <div className="text-sm text-primary font-medium">{step}</div>;
      }
      return <span className="text-muted-foreground">-</span>;
    },
    enableSorting: false,
  },
  // 재시도 횟수
  {
    accessorKey: "retry_count",
    header: "재시도",
    cell: ({ row }) => {
      const retryCount = row.getValue("retry_count") as number;
      if (retryCount === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <Badge variant="outline" className="font-mono">
          {retryCount}회
        </Badge>
      );
    },
  },
  // CPU 사용량
  {
    accessorKey: "cpu_usage",
    header: "CPU",
    cell: ({ row }) => {
      const cpu = row.getValue("cpu_usage") as number | undefined;
      return (
        <div className="text-sm text-muted-foreground">
          {formatResource(cpu, "s")}
        </div>
      );
    },
  },
  // 메모리 사용량
  {
    accessorKey: "memory_usage",
    header: "메모리",
    cell: ({ row }) => {
      const memory = row.getValue("memory_usage") as number | undefined;
      return (
        <div className="text-sm text-muted-foreground">
          {formatResource(memory, "MB")}
        </div>
      );
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end items-center gap-2">
        {onViewDetails && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onViewDetails(row.original)}
            title="상세 보기"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
    enableSorting: false,
  },
];
