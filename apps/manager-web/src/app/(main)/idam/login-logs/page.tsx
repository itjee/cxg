'use client';

/**
 * @file page.tsx
 * @description 로그인 이력 페이지
 */

import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  LoginLogsHeader,
  LoginLogsStats,
  LoginLogsFilters,
  LoginLogsTable,
  LoginLogsDetail,
} from '@/features/idam/login-logs';
import {
  useLoginLogs,
  useDeleteLoginLog,
} from '@/features/idam/login-logs/hooks';
import { useLoginLogStore } from '@/features/idam/login-logs/stores';
import type { LoginLog } from '@/features/idam/login-logs/types';

export default function LoginLogsPage() {
  const {
    globalFilter,
    selectedAttemptType,
    selectedSuccess,
    selectedUserType,
    selectedMfaUsed,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    openDetail,
  } = useLoginLogStore();

  // 서버 사이드 페이징 조회
  const {
    data: logsResponse,
    isLoading,
    error,
    refetch,
  } = useLoginLogs({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    attempt_type: selectedAttemptType || undefined,
    success: selectedSuccess ? selectedSuccess === 'true' : undefined,
    user_type: selectedUserType || undefined,
    mfa_used: selectedMfaUsed ? selectedMfaUsed === 'true' : undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  // 삭제 mutation
  const deleteLogMutation = useDeleteLoginLog();

  const logs = logsResponse?.data || [];
  const totalItems = logsResponse?.total || 0;

  // 통계 계산
  const stats = useMemo(() => {
    const total = logs.length;
    const successCount = logs.filter((log) => log.success).length;
    const failedCount = logs.filter((log) => !log.success).length;
    const mfaUsedCount = logs.filter((log) => log.mfa_used).length;
    const lockedCount = logs.filter((log) => log.attempt_type === 'LOCKED').length;
    
    // 고유 사용자 수 계산
    const uniqueUserIds = new Set(
      logs.filter((log) => log.user_id).map((log) => log.user_id)
    );
    const uniqueUsers = uniqueUserIds.size;

    return {
      total,
      successCount,
      failedCount,
      mfaUsedCount,
      lockedCount,
      uniqueUsers,
    };
  }, [logs]);

  // 로그인 이력 삭제 핸들러
  const handleDelete = (log: LoginLog) => {
    if (
      window.confirm(
        `로그인 이력을 삭제하시겠습니까?\n\n사용자: ${log.username || 'N/A'}\nIP: ${log.ip_address}`
      )
    ) {
      deleteLogMutation.mutate(log.id, {
        onSuccess: () => {
          toast.success('로그인 이력이 삭제되었습니다');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || '로그인 이력 삭제 실패');
        },
      });
    }
  };

  // 내보내기 핸들러
  const handleExport = () => {
    toast.info('내보내기 기능은 준비 중입니다');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">에러: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoginLogsHeader onRefresh={() => refetch()} onExport={handleExport} />
      <LoginLogsStats
        total={stats.total}
        successCount={stats.successCount}
        failedCount={stats.failedCount}
        mfaUsedCount={stats.mfaUsedCount}
        lockedCount={stats.lockedCount}
        uniqueUsers={stats.uniqueUsers}
      />
      <LoginLogsFilters />
      <LoginLogsTable
        data={logs}
        onViewDetail={(log) => openDetail(log.id)}
        onDelete={handleDelete}
      />
      <LoginLogsDetail />
    </div>
  );
}
