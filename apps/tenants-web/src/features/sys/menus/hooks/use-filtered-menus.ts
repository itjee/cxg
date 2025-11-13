/**
 * @file use-filtered-menus.ts
 * @description 필터 조건에 따라 메뉴 목록을 필터링하는 hook
 */

import { useMemo } from 'react';
import type { Menu, MenuType, ModuleCode } from '../types';

/**
 * 메뉴 필터 옵션 인터페이스
 */
export interface MenuFilterOptions {
  menuType?: MenuType | string;
  moduleCode?: ModuleCode | string;
  parentId?: string;
  isVisible?: boolean;
}

/**
 * 메뉴 목록을 필터 조건에 따라 필터링
 * 
 * @param menus - 원본 메뉴 목록
 * @param filters - 필터 조건 (menuType, moduleCode, parentId, isVisible)
 * @returns 필터링된 메뉴 목록
 * 
 * @example
 * ```tsx
 * const filteredMenus = useFilteredMenus(allMenus, {
 *   menuType: 'MENU',
 *   moduleCode: 'SYS',
 * });
 * ```
 */
export function useFilteredMenus(
  menus: Menu[],
  filters: MenuFilterOptions
): Menu[] {
  return useMemo(() => {
    return menus.filter((menu) => {
      // 메뉴 타입 필터
      if (filters.menuType && menu.menu_type !== filters.menuType) {
        return false;
      }

      // 모듈 코드 필터
      if (filters.moduleCode && menu.module_code !== filters.moduleCode) {
        return false;
      }

      // 부모 메뉴 필터
      if (filters.parentId !== undefined) {
        if (filters.parentId === '' && menu.parent_id) {
          return false; // 최상위 메뉴만 표시
        }
        if (filters.parentId && menu.parent_id !== filters.parentId) {
          return false;
        }
      }

      // 표시 여부 필터
      if (filters.isVisible !== undefined && menu.is_visible !== filters.isVisible) {
        return false;
      }

      return true;
    });
  }, [menus, filters.menuType, filters.moduleCode, filters.parentId, filters.isVisible]);
}
