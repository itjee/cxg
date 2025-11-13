'use client';

/**
 * @file menus-filters.tsx
 * @description 메뉴 관리 페이지 필터 컴포넌트
 * 
 * 메뉴 목록을 검색 및 필터링하기 위한 UI 제공
 * - 전역 검색 (메뉴 코드, 메뉴명)
 * - 메뉴 타입 필터 (드롭다운)
 * - 모듈 코드 필터 (드롭다운)
 * - 부모 메뉴 필터 (드롭다운)
 */

import { useMemo } from 'react';
import { Filters, type FilterConfig } from '@/components/filters';
import { useMenuStore } from '../stores';
import type { Menu } from '../types';

/**
 * MenusFilters 컴포넌트 Props 인터페이스
 */
interface MenusFiltersProps {
  /** 필터 옵션 생성을 위한 메뉴 목록 */
  menus: Menu[];
}

/**
 * 메뉴 관리 페이지 필터 컴포넌트
 * 
 * @description
 * - 공통 Filters 컴포넌트를 래핑하여 메뉴 목록 필터링 기능 제공
 * - useMenuStore와 연동하여 필터 상태 관리
 * - 메뉴 목록에서 고유한 모듈 코드와 부모 메뉴 목록을 추출하여 필터 옵션 생성
 * 
 * @features
 * - 전역 검색: 메뉴 코드, 메뉴명으로 검색
 * - 메뉴 타입 필터: MENU, FOLDER, LINK, DIVIDER 중 선택
 * - 모듈 코드 필터: 동적으로 생성된 모듈 목록에서 선택
 * - 부모 메뉴 필터: 동적으로 생성된 부모 메뉴 목록에서 선택
 * - 필터 초기화: 모든 필터를 한 번에 초기화
 * 
 * @example
 * ```tsx
 * <MenusFilters menus={allMenus} />
 * ```
 */
export function MenusFilters({ menus }: MenusFiltersProps) {
  // Zustand 스토어에서 필터 상태 및 액션 가져오기
  const {
    globalFilter,        // 전역 검색어
    setGlobalFilter,     // 전역 검색어 설정 함수
    selectedMenuType,    // 선택된 메뉴 타입
    setSelectedMenuType, // 메뉴 타입 설정 함수
    selectedModuleCode,  // 선택된 모듈 코드
    setSelectedModuleCode, // 모듈 코드 설정 함수
    selectedParentId,    // 선택된 부모 메뉴
    setSelectedParentId, // 부모 메뉴 설정 함수
    resetFilters,        // 모든 필터 초기화 함수
  } = useMenuStore();

  /**
   * 메뉴 목록에서 고유한 모듈 코드 목록 추출
   * 
   * @memo menus 변경 시에만 재계산
   */
  const uniqueModuleCodes = useMemo(() => {
    return Array.from(
      new Set(menus.map((m) => m.module_code).filter(Boolean))
    ) as string[];
  }, [menus]);

  /**
   * 부모 메뉴 목록 추출 (depth 0 또는 1인 메뉴)
   * 
   * @memo menus 변경 시에만 재계산
   */
  const parentMenus = useMemo(() => {
    return menus.filter((m) => m.depth <= 1);
  }, [menus]);

  /**
   * 필터 변경 핸들러 맵
   * 
   * @description 각 필터의 key와 핸들러 함수를 매핑
   * @memo setter 함수 변경 시에만 재생성
   */
  const filterHandlers = useMemo(
    () => ({
      globalFilter: setGlobalFilter,
      selectedMenuType: setSelectedMenuType,
      selectedModuleCode: setSelectedModuleCode,
      selectedParentId: setSelectedParentId,
    }),
    [setGlobalFilter, setSelectedMenuType, setSelectedModuleCode, setSelectedParentId]
  );

  /**
   * 필터 설정 배열
   * 
   * @description Filters 컴포넌트에 전달할 필터 설정
   * - 검색: 텍스트 입력 필드
   * - 메뉴 타입: 셀렉트 박스 (MENU, FOLDER, LINK, DIVIDER)
   * - 모듈 코드: 셀렉트 박스 (동적 옵션)
   * - 부모 메뉴: 셀렉트 박스 (동적 옵션)
   * 
   * @memo uniqueModuleCodes, parentMenus 변경 시에만 재생성
   */
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'globalFilter',
        label: '검색',
        description: '메뉴 코드, 메뉴명...',
        type: 'search',
      },
      {
        key: 'selectedMenuType',
        label: '메뉴 타입',
        description: '전체 타입',
        type: 'select',
        options: [
          { label: 'MENU', value: 'MENU' },
          { label: 'FOLDER', value: 'FOLDER' },
          { label: 'LINK', value: 'LINK' },
          { label: 'DIVIDER', value: 'DIVIDER' },
        ],
      },
      {
        key: 'selectedModuleCode',
        label: '모듈',
        description: '전체 모듈',
        type: 'select',
        options: uniqueModuleCodes.map((code) => ({
          label: code,
          value: code,
        })),
      },
      {
        key: 'selectedParentId',
        label: '부모 메뉴',
        description: '전체 메뉴',
        type: 'select',
        options: parentMenus.map((menu) => ({
          label: menu.name,
          value: menu.id,
        })),
      },
    ],
    [uniqueModuleCodes, parentMenus]
  );

  /**
   * 현재 필터 값 객체
   * 
   * @description Filters 컴포넌트에 전달할 현재 필터 값
   */
  const filterValues = {
    globalFilter,
    selectedMenuType,
    selectedModuleCode,
    selectedParentId,
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
