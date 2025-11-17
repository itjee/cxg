'use client';

/**
 * @file page.tsx
 * @description 세션 관리 페이지
 * Jira 스타일 필터링: 검색 + 필터 팝업
 *
 * 필터링 아키텍처:
 * - searchText → search 파라미터로 백엔드 GraphQL 쿼리에 전송 (전체 필드 검색)
 * - status → status 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - sessionType → session_type 파라미터로 백엔드 GraphQL 쿼리에 전송 (필터)
 * - 적용 버튼 클릭 시만 서버 쿼리 실행
 */

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  SessionsHeader,
  SessionsStats,
  SessionsFilter,
  SessionsTable,
  type SessionsFilterState,
} from '@/features/idam/sessions';
import {
  useSessions,
  useDeleteSession,
  useRevokeSession,
} from '@/features/idam/sessions/hooks';
import { useSessionsStore } from '@/features/idam/sessions/stores';
import type { Session } from '@/features/idam/sessions/types';

export default function SessionsPage() {
  const {
    currentPage,
    itemsPerPage,
    setSearchText,
    setSelectedStatus,
    setSelectedSessionType,
  } = useSessionsStore();

  // 로컬 필터 상태 (팝업에서 수정, 적용 버튼 클릭 시 확정)
  const [localFilters, setLocalFilters] = useState<SessionsFilterState>({
    status: null,
    sessionType: null,
  });

  // 서버에 전달할 필터 상태
  const [appliedFilters, setAppliedFilters] = useState<SessionsFilterState>({
    status: null,
    sessionType: null,
  });

  const [searchText, setSearchTextLocal] = useState("");

  // 서버 사이드 페이징 조회
  const {
    data: sessionsResponse,
    isLoading,
    error,
    refetch,
  } = useSessions({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    status: appliedFilters.status || undefined,
    session_type: appliedFilters.sessionType || undefined,
  });

  // 삭제 mutation
  const deleteSessionMutation = useDeleteSession();
  
  // 취소 mutation
  const revokeSessionMutation = useRevokeSession();

  const sessions = sessionsResponse?.data || [];
  const totalItems = sessionsResponse?.total || 0;

  const handleSearchChange = (text: string) => {
    setSearchTextLocal(text);
    setSearchText(text);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setSelectedStatus(localFilters.status || null);
    setSelectedSessionType(localFilters.sessionType || null);
  };

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

      {/* Jira 스타일 검색 + 필터 */}
      <SessionsFilter
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
      />

      <SessionsTable data={sessions} onRevoke={handleRevoke} onDelete={handleDelete} />
    </div>
  );
}
