/**
 * @file onboardings-columns.tsx
 * @description 온보딩 프로세스 테이블 컬럼 정의
 */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import type { Onboarding, OnboardingStepStatus, OnboardingStepName } from '../types';
import { RefreshCw, Eye, Clock, CheckCircle2, XCircle, Loader2, SkipForward, Circle } from 'lucide-react';

/**
 * 상수 정의 - 단계 상태별 색상 및 아이콘
 */
const statusColors: Record<OnboardingStepStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  SKIPPED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const statusLabels: Record<OnboardingStepStatus, string> = {
  PENDING: '대기',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  FAILED: '실패',
  SKIPPED: '건너뜀',
};

const statusIcons: Record<OnboardingStepStatus, any> = {
  PENDING: Circle,
  IN_PROGRESS: Loader2,
  COMPLETED: CheckCircle2,
  FAILED: XCircle,
  SKIPPED: SkipForward,
};

const stepNameLabels: Record<OnboardingStepName, string> = {
  REGISTRATION: '등록',
  EMAIL_VERIFICATION: '이메일 인증',
  SCHEMA_CREATION: '스키마 생성',
  INITIAL_SETUP: '초기 설정',
  DATA_MIGRATION: '데이터 마이그레이션',
  CONFIGURATION: '환경 설정',
  COMPLETED: '완료',
};

/**
 * 포맷 함수
 */
const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

const formatDuration = (startedAt?: string, completedAt?: string) => {
  if (!startedAt || !completedAt) return '-';
  try {
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}분 ${diffSecs}초`;
  } catch {
    return '-';
  }
};

/**
 * 액션 핸들러 타입
 */
interface GetColumnsParams {
  onViewDetails?: (onboarding: Onboarding) => void;
  onRetry?: (onboarding: Onboarding) => void;
}

/**
 * 컬럼 생성 함수
 */
export const getOnboardingsColumns = ({
  onViewDetails,
  onRetry,
}: GetColumnsParams = {}): ColumnDef<Onboarding>[] => [
  // NO 컬럼
  {
    id: 'rowNumber',
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center text-base text-muted-foreground">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 60,
  },
  // 테넌트 ID (축약)
  {
    accessorKey: 'tenant_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="테넌트" />
    ),
    cell: ({ row }) => {
      const tenantId = row.getValue('tenant_id') as string;
      return (
        <code className="text-sm bg-muted px-2 py-1 rounded font-mono" title={tenantId}>
          {tenantId.slice(0, 8)}...
        </code>
      );
    },
  },
  // 단계명
  {
    accessorKey: 'step_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="단계" />
    ),
    cell: ({ row }) => {
      const stepName = row.getValue('step_name') as OnboardingStepName;
      return (
        <div className="font-light">
          {stepNameLabels[stepName] || stepName}
        </div>
      );
    },
  },
  // 순서
  {
    accessorKey: 'step_order',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="순서" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.getValue('step_order')}
      </div>
    ),
    size: 80,
  },
  // 상태
  {
    accessorKey: 'step_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('step_status') as OnboardingStepStatus;
      const Icon = statusIcons[status];
      return (
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} />
          <Badge variant="outline" className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      );
    },
    size: 120,
  },
  // 시작 시간
  {
    accessorKey: 'started_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시작 시간" />
    ),
    cell: ({ row }) => (
      <div className="text-base text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {formatDateTime(row.getValue('started_at'))}
      </div>
    ),
  },
  // 완료 시간
  {
    accessorKey: 'completed_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="완료 시간" />
    ),
    cell: ({ row }) => (
      <div className="text-base text-muted-foreground">
        {formatDateTime(row.getValue('completed_at'))}
      </div>
    ),
  },
  // 소요 시간
  {
    id: 'duration',
    header: '소요 시간',
    cell: ({ row }) => {
      const duration = formatDuration(
        row.original.started_at,
        row.original.completed_at
      );
      return (
        <div className="text-base text-muted-foreground">
          {duration}
        </div>
      );
    },
    size: 100,
  },
  // 재시도 횟수
  {
    accessorKey: 'retry_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="재시도" />
    ),
    cell: ({ row }) => {
      const count = row.getValue('retry_count') as number;
      return (
        <div className="text-center">
          {count > 0 ? (
            <Badge variant="outline" className="bg-orange-50 text-orange-800">
              {count}회
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
    size: 80,
  },
  // 액션
  {
    id: 'actions',
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => {
      const status = row.original.step_status;
      return (
        <div className="flex justify-end gap-2">
          {onViewDetails && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails(row.original)}
              className="h-8 w-8 p-0"
              title="상세 보기"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {status === 'FAILED' && onRetry && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRetry(row.original)}
              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
              title="재시도"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
    enableSorting: false,
    size: 100,
  },
];
