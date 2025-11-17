'use client';

/**
 * @file page.tsx
 * @description 로그인 이력 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - success → success 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - attemptType → attempt_type 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  LoginLogsHeader,
  LoginLogsStats,
  LoginLogsFilter,
  LoginLogsTable,
  type LoginLogsFilterState,
} from '@/features/idam/login-logs';
import {
  useLoginLogs,
  useDeleteLoginLog,
} from '@/features/idam/login-logs/hooks';
import { useLoginLogsStore } from '@/features/idam/login-logs/stores';
import type { LoginLog } from '@/features/idam/login-logs/types';

export default function LoginLogsPage() {
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setSelectedAttemptType,
    setSelectedSuccess,
  } = useLoginLogsStore();

  // 로컬 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 확정)
  const [localFilters, setLocalFilters] = useState<LoginLogsFilterState>({
    success: null,
    attemptType: null,
  });

  // 서버에 전달할 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<LoginLogsFilterState>({
    success: null,
    attemptType: null,
  });

  const [searchText, setSearchTextLocal] = useState("");

  // 서버 사이드 페이징 조회
  const {
    data: logsResponse,
    isLoading,
    error,
    refetch,
  } = useLoginLogs({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    attempt_type: appliedFilters.attemptType || undefined,
    success: appliedFilters.success ? appliedFilters.success === 'true' : undefined,
  });

  // 삭제 mutation
  const deleteLogMutation = useDeleteLoginLog();

  const logs = logsResponse?.data || [];
  const totalItems = logsResponse?.total || 0;

  const handleSearchChange = (text: string) => {
    setSearchTextLocal(text);
    setSearchText(text);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setSelectedSuccess(localFilters.success || null);
    setSelectedAttemptType(localFilters.attemptType || null);
  };

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

  // 상세 보기 핸들러
  const handleViewDetail = (log: LoginLog) => {
    const { openDetail } = useLoginLogsStore.getState();
    openDetail(log.id);
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

      {/* Jira 스타일 검색 + 필터 */}
      <LoginLogsFilter
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
      />

      <LoginLogsTable
        data={logs}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />
    </div>
  );
}
