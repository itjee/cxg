/**
 * useFilteredPermissions Hook
 * 권한 필터링 로직
 */

import { useMemo } from 'react';
import type { Permission, ModuleCode, ActionType } from '../types';

export function useFilteredPermissions(
  permissions: Permission[],
  filters: {
    module?: ModuleCode | 'all';
    action?: ActionType | 'all';
    status?: string; // 'all' | 'active' | 'inactive'
  }
) {
  return useMemo(() => {
    return permissions.filter((permission) => {
      // 모듈 필터
      if (filters.module && filters.module !== 'all' && permission.module_code !== filters.module) {
        return false;
      }

      // 액션 필터
      if (filters.action && filters.action !== 'all' && permission.action !== filters.action) {
        return false;
      }

      // 상태 필터
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active' && !permission.is_active) return false;
        if (filters.status === 'inactive' && permission.is_active) return false;
      }

      return true;
    });
  }, [permissions, filters]);
}
