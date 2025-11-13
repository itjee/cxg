'use client';

/**
 * @file users-filters.tsx
 * @description 사용자 관리 페이지 필터 컴포넌트
 * 
 * 사용자 목록을 검색 및 필터링하기 위한 UI 제공
 * - 전역 검색 (사용자명, 이름, 이메일)
 * - 역할 필터 (드롭다운)
 * - 상태 필터 (활성/비활성)
 */

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useUserStore } from '../stores';
import type { User } from '@/shared/types';

/**
 * UsersFilters 컴포넌트 Props 인터페이스
 */
interface UsersFiltersProps {
  /** 역할 필터 옵션 생성을 위한 사용자 목록 */
  users: User[];
}

/**
 * 사용자 관리 페이지 필터 컴포넌트
 * 
 * @description
 * - 공통 Filters 컴포넌트를 래핑하여 사용자 목록 필터링 기능 제공
 * - useUserStore와 연동하여 필터 상태 관리
 * - 사용자 목록에서 고유한 역할 목록을 추출하여 역할 필터 옵션 생성
 * 
 * @features
 * - 전역 검색: 사용자명, 이름, 이메일로 검색
 * - 역할 필터: 동적으로 생성된 역할 목록에서 선택
 * - 상태 필터: 활성/비활성 상태로 필터링
 * - 필터 초기화: 모든 필터를 한 번에 초기화
 * 
 * @example
 * ```tsx
 * <UsersFilters users={allUsers} />
 * ```
 */
export function UsersFilters({ users }: UsersFiltersProps) {
  // Zustand 스토어에서 필터 상태 및 액션 가져오기
  const {
    globalFilter,        // 전역 검색어
    setGlobalFilter,     // 전역 검색어 설정 함수
    selectedRole,        // 선택된 역할
    setSelectedRole,     // 역할 설정 함수
    selectedStatus,      // 선택된 상태
    setSelectedStatus,   // 상태 설정 함수
    resetFilters,        // 모든 필터 초기화 함수
  } = useUserStore();

  /**
   * 사용자 목록에서 고유한 역할 목록 추출
   * 
   * @memo users 변경 시에만 재계산
   */
  const uniqueRoles = useMemo(() => {
    return Array.from(
      new Set(users.map((u) => u.role_name).filter(Boolean))
    ) as string[];
  }, [users]);

  /**
   * 필터 변경 핸들러 맵
   * 
   * @description 각 필터의 key와 핸들러 함수를 매핑
   * @memo setter 함수 변경 시에만 재생성
   */
  const filterHandlers = useMemo(
    () => ({
      globalFilter: setGlobalFilter,
      selectedRole: setSelectedRole,
      selectedStatus: setSelectedStatus,
    }),
    [setGlobalFilter, setSelectedRole, setSelectedStatus]
  );

  /**
   * 필터 설정 배열
   * 
   * @description Filters 컴포넌트에 전달할 필터 설정
   * - 검색: 텍스트 입력 필드
   * - 역할: 셀렉트 박스 (동적 옵션)
   * - 상태: 셀렉트 박스 (활성/비활성)
   * 
   * @memo uniqueRoles 변경 시에만 재생성
   */
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '사용자명, 이름, 이메일...',
        type: 'search',
      },
      {
        key: 'selectedRole',
        label: '역할',
        description: '전체 역할',
        type: 'select',
        options: uniqueRoles.map((role) => ({
          label: role,
          value: role,
        })),
      },
      {
        key: 'selectedStatus',
        label: '상태',
        description: '전체 상태',
        type: 'select',
        options: [
          { label: '활성', value: 'active' },
          { label: '비활성', value: 'inactive' },
        ],
      },
    ],
    [uniqueRoles]
  );

  /**
   * 현재 필터 값 객체
   * 
   * @description Filters 컴포넌트에 전달할 현재 필터 값
   */
  const filterValues = {
    globalFilter,
    selectedRole,
    selectedStatus,
  };

  /**
   * 필터 변경 핸들러
   * 
   * @description 필터 값 변경 시 호출되어 해당 필터의 setter 함수 실행
   * @param key - 변경된 필터의 key
   * @param value - 새로운 필터 값
   */
  const handleFilterChange = (key: string, value: string | string[]) => {
    const handler = filterHandlers[key as keyof typeof filterHandlers];
    if (handler) {
      handler(value as string);
    }
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
