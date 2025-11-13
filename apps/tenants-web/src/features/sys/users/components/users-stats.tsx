'use client';

/**
 * @file users-stats.tsx
 * @description 사용자 관리 페이지 통계 카드 컴포넌트
 * 
 * 사용자 목록 데이터를 기반으로 다양한 통계 정보를 계산하여 시각적으로 표시
 * - 전체 사용자 수
 * - 활성 사용자 수 및 활성률
 * - 비활성 사용자 수 및 비활성률
 * - 최근 7일 이내 접속한 사용자 수 및 비율
 */

import { useMemo } from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { User } from '@/shared/types';

/**
 * UsersStats 컴포넌트 Props 인터페이스
 */
interface UsersStatsProps {
  /**
   * 통계를 계산할 사용자 목록
   * 
   * @description
   * - 필터링된 사용자 목록을 전달하면 필터링된 데이터 기반으로 통계 계산
   * - 전체 사용자 목록을 전달하면 전체 통계 표시
   */
  users: User[];
}

/**
 * 사용자 통계 카드 컴포넌트
 * 
 * @description
 * - 전달된 사용자 목록을 기반으로 실시간 통계 계산
 * - 4개의 통계 카드로 구성 (전체/활성/비활성/최근접속)
 * - 백분율 및 트렌드 정보 표시
 * 
 * @features
 * - 전체 사용자: 총 사용자 수 및 활성 사용자 수
 * - 활성 사용자: 활성 사용자 수 및 활성률 (%)
 * - 비활성 사용자: 비활성 사용자 수 및 비활성률 (%)
 * - 7일 이내 접속: 최근 7일 이내 로그인한 사용자 수 및 비율 (%)
 * 
 * @performance
 * - useMemo를 사용하여 users 배열 변경 시에만 통계 재계산
 * 
 * @example
 * ```tsx
 * <UsersStats users={filteredUsers} />
 * ```
 */
export function UsersStats({ users }: UsersStatsProps) {
  /**
   * 통계 데이터 계산
   * 
   * @description
   * - 전체/활성/비활성 사용자 수 계산
   * - 최근 7일 이내 접속 사용자 수 계산
   * - 각 카테고리별 비율 계산
   * 
   * @memo users 배열 변경 시에만 재계산
   */
  const stats = useMemo(() => {
    // 기본 카운트
    const total = users.length;
    const active = users.filter((u) => u.is_active).length;
    const inactive = users.filter((u) => !u.is_active).length;
    
    // 최근 7일 이내 로그인 사용자 계산
    const recentLogin = users.filter((u) => {
      if (!u.last_login_at) return false;
      const days =
        (Date.now() - new Date(u.last_login_at).getTime()) /
        (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length;

    // 통계 카드 설정 배열 반환
    return [
      {
        title: '전체 사용자',
        value: total,
        description: `${active}개 활성`,
        icon: <Users className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '명' },
      },
      {
        title: '활성 사용자',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <UserCheck className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 사용자',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <UserX className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '7일 이내 접속',
        value: recentLogin,
        description: `${total > 0 ? ((recentLogin / total) * 100).toFixed(0) : 0}% 최근 활동`,
        icon: <Clock className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: recentLogin, isPositive: true, label: '명' },
      },
    ];
  }, [users]);

  // 4열 그리드로 통계 카드 표시
  return <StatsCards cards={stats} columns={4} />;
}
