"use client";

/**
 * @file tasks-columns.tsx
 * @description 스케줄된 작업 테이블 컬럼 정의
 *
 * 역할:
 * - TanStack Table 컬럼 정의
 * - 포맷 함수 (날짜, 시간, CRON)
 * - 상수 (상태 색상 매핑)
 * - 액션 핸들러 타입
 */

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2, Play, Pause, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Task, TaskType, LastRunStatus } from "../types";

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
 * 성공률 계산
 */
const calculateSuccessRate = (total: number, successful: number): string => {
  if (total === 0) return "0%";
  return `${((successful / total) * 100).toFixed(1)}%`;
};

/**
 * 작업 유형 라벨 매핑
 */
const taskTypeLabels: Record<TaskType, string> = {
  SYSTEM_CLEANUP: "시스템 정리",
  DATA_SYNC: "데이터 동기화",
  REPORT_GENERATION: "리포트 생성",
  BACKUP: "백업",
  MAINTENANCE: "유지보수",
  MONITORING: "모니터링",
};

/**
 * 작업 유형 색상 매핑
 */
const taskTypeColors: Record<TaskType, "default" | "secondary" | "outline"> = {
  SYSTEM_CLEANUP: "secondary",
  DATA_SYNC: "default",
  REPORT_GENERATION: "outline",
  BACKUP: "default",
  MAINTENANCE: "secondary",
  MONITORING: "outline",
};

/**
 * 마지막 실행 상태 설정
 */
const lastRunStatusConfig: Record<
  LastRunStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  SUCCESS: { label: "성공", variant: "secondary" },
  FAILED: { label: "실패", variant: "destructive" },
  TIMEOUT: { label: "타임아웃", variant: "destructive" },
  CANCELED: { label: "취소", variant: "outline" },
};

/**
 * 컬럼 생성 함수 파라미터
 */
interface GetColumnsParams {
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onToggle?: (task: Task) => void;
  onRunNow?: (task: Task) => void;
}

/**
 * 스케줄된 작업 테이블 컬럼 정의 생성 함수
 */
export const getTasksColumns = ({
  onEdit,
  onDelete,
  onToggle,
  onRunNow,
}: GetColumnsParams = {}): ColumnDef<Task>[] => [
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
  // 작업명
  {
    accessorKey: "task_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="작업명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("task_name")}</div>
    ),
  },
  // 작업 유형
  {
    accessorKey: "task_type",
    header: "작업 유형",
    cell: ({ row }) => {
      const type = row.getValue("task_type") as TaskType;
      return (
        <Badge variant={taskTypeColors[type]}>{taskTypeLabels[type]}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === "" || row.getValue(id) === value;
    },
  },
  // 스케줄
  {
    accessorKey: "schedule_expression",
    header: "스케줄",
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
        {row.getValue("schedule_expression")}
      </code>
    ),
    enableSorting: false,
  },
  // 다음 실행
  {
    accessorKey: "next_run_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="다음 실행" />
    ),
    cell: ({ row }) => {
      const nextRun = row.getValue("next_run_at") as string | undefined;
      return <div className="text-sm">{formatDateTime(nextRun)}</div>;
    },
  },
  // 마지막 실행
  {
    accessorKey: "last_run_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="마지막 실행" />
    ),
    cell: ({ row }) => {
      const lastRun = row.getValue("last_run_at") as string | undefined;
      return <div className="text-sm">{formatDateTime(lastRun)}</div>;
    },
  },
  // 마지막 상태
  {
    accessorKey: "last_run_status",
    header: "마지막 상태",
    cell: ({ row }) => {
      const status = row.getValue("last_run_status") as
        | LastRunStatus
        | undefined;
      if (!status) return <span className="text-muted-foreground">-</span>;
      const config = lastRunStatusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  // 성공률
  {
    accessorKey: "successful_runs",
    header: "성공률",
    cell: ({ row }) => {
      const total = row.original.total_runs;
      const successful = row.getValue("successful_runs") as number;
      return (
        <div className="text-sm text-muted-foreground">
          {calculateSuccessRate(total, successful)}
        </div>
      );
    },
  },
  // 상태
  {
    accessorKey: "enabled",
    header: "상태",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return (
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "활성" : "비활성"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "true") return row.getValue(id) === true;
      if (value === "false") return row.getValue(id) === false;
      return true;
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end items-center gap-2">
        {onRunNow && row.original.enabled && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onRunNow(row.original)}
            title="지금 실행"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        )}
        {onToggle && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onToggle(row.original)}
            title={row.original.enabled ? "비활성화" : "활성화"}
          >
            {row.original.enabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
        {onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(row.original)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDelete(row.original)}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
    enableSorting: false,
  },
];
