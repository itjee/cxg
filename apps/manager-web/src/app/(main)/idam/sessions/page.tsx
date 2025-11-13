'use client';

/**
 * @file page.tsx
 * @description 세션 관리 페이지
 */

import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  SessionsHeader,
  SessionsStats,
  SessionsFilters,
  SessionsTable,
} from '@/features/idam/sessions';
import {
  useSessions,
  useDeleteSession,
  useRevokeSession,
} from '@/features/idam/sessions/hooks';
import { useSessionStore } from '@/features/idam/sessions/stores';
import type { Session } from '@/features/idam/sessions/types';

export default function SessionsPage() {
  const {
    globalFilter,
    selectedStatus,
    selectedSessionType,
    currentPage,
    itemsPerPage,
  } = useSessionStore();

  // 서버 사이드 페이징 조회
  const {
    data: sessionsResponse,
    isLoading,
    error,
    refetch,
  } = useSessions({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    status: selectedStatus || undefined,
    session_type: selectedSessionType || undefined,
  });

  // 삭제 mutation
  const deleteSessionMutation = useDeleteSession();
  
  // 취소 mutation
  const revokeSessionMutation = useRevokeSession();

  const sessions = sessionsResponse?.data || [];
  const totalItems = sessionsResponse?.total || 0;

  // 통계 계산
  const stats = useMemo(() => {
    const total = sessions.length;
    const active = sessions.filter((s) => s.status === 'ACTIVE').length;
    const expired = sessions.filter((s) => s.status === 'EXPIRED').length;
    const revoked = sessions.filter((s) => s.status === 'REVOKED').length;
    const mfaVerified = sessions.filter((s) => s.mfa_verified).length;

    return { total, active, expired, revoked, mfaVerified };
  }, [sessions]);

  // 세션 취소 핸들러
  const handleRevoke = (session: Session) => {
    if (window.confirm(`세션을 취소하시겠습니까?\n\nIP: ${session.ip_address}`)) {
      revokeSessionMutation.mutate(session.id, {
        onSuccess: () => {
          toast.success('세션이 취소되었습니다');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || '세션 취소 실패');
        },
      });
    }
  };

  // 세션 삭제 핸들러
  const handleDelete = (session: Session) => {
    if (window.confirm(`세션을 삭제하시겠습니까?\n\nIP: ${session.ip_address}`)) {
      deleteSessionMutation.mutate(session.id, {
        onSuccess: () => {
          toast.success('세션이 삭제되었습니다');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || '세션 삭제 실패');
        },
      });
    }
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
      <SessionsHeader onRefresh={() => refetch()} />
      <SessionsStats
        total={stats.total}
        active={stats.active}
        expired={stats.expired}
        revoked={stats.revoked}
        mfaVerified={stats.mfaVerified}
      />
      <SessionsFilters />
      <SessionsTable data={sessions} onRevoke={handleRevoke} onDelete={handleDelete} />
    </div>
  );
}
