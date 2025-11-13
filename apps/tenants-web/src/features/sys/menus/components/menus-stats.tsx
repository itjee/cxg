'use client';

/**
 * @file menus-stats.tsx
 * @description 메뉴 관리 페이지 통계 카드 컴포넌트
 * 
 * 메뉴 목록 데이터를 기반으로 다양한 통계 정보를 계산하여 시각적으로 표시
 * - 전체 메뉴 수
 * - 활성 메뉴 수 및 활성률
 * - 최상위 메뉴 수
 * - 메뉴 타입별 수
 */

import { useMemo } from 'react';
import { Menu as MenuIcon, Folder, Link, Eye } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Menu } from '../types';

/**
 * MenusStats 컴포넌트 Props 인터페이스
 */
interface MenusStatsProps {
  /**
   * 통계를 계산할 메뉴 목록
   * 
   * @description
   * - 필터링된 메뉴 목록을 전달하면 필터링된 데이터 기반으로 통계 계산
   * - 전체 메뉴 목록을 전달하면 전체 통계 표시
   */
  menus: Menu[];
}

/**
 * 메뉴 통계 카드 컴포넌트
 * 
 * @description
 * - 전달된 메뉴 목록을 기반으로 실시간 통계 계산
 * - 4개의 통계 카드로 구성 (전체/활성/최상위/타입별)
 * - 백분율 및 트렌드 정보 표시
 * 
 * @features
 * - 전체 메뉴: 총 메뉴 수 및 활성 메뉴 수
 * - 활성 메뉴: 활성 메뉴 수 및 활성률 (%)
 * - 최상위 메뉴: depth 0인 메뉴 수
 * - 일반 메뉴: MENU 타입 메뉴 수
 * 
 * @performance
 * - useMemo를 사용하여 menus 배열 변경 시에만 통계 재계산
 * 
 * @example
 * ```tsx
 * <MenusStats menus={filteredMenus} />
 * ```
 */
export function MenusStats({ menus }: MenusStatsProps) {
  /**
   * 통계 데이터 계산
   * 
   * @description
   * - 전체/활성/최상위 메뉴 수 계산
   * - 메뉴 타입별 수 계산
   * - 각 카테고리별 비율 계산
   * 
   * @memo menus 배열 변경 시에만 재계산
   */
  const stats = useMemo(() => {
    // 기본 카운트
    const total = menus.length;
    const active = menus.filter((m) => m.is_active).length;
    const rootMenus = menus.filter((m) => m.depth === 0).length;
    const regularMenus = menus.filter((m) => m.menu_type === 'MENU').length;

    // 통계 카드 설정 배열 반환
    return [
      {
        title: '전체 메뉴',
        value: total,
        description: `${active}개 활성`,
        icon: <MenuIcon className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 메뉴',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <Eye className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '최상위 메뉴',
        value: rootMenus,
        description: `${total > 0 ? ((rootMenus / total) * 100).toFixed(0) : 0}% 비율`,
        icon: <Folder className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: rootMenus, isPositive: true, label: '개' },
      },
      {
        title: '일반 메뉴',
        value: regularMenus,
        description: `${total > 0 ? ((regularMenus / total) * 100).toFixed(0) : 0}% 비율`,
        icon: <Link className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: regularMenus, isPositive: true, label: '개' },
      },
    ];
  }, [menus]);

  // 4열 그리드로 통계 카드 표시
  return <StatsCards cards={stats} columns={4} />;
}
