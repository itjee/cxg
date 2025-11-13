/**
 * useFilteredRoles Hook
 * 역할 필터링 로직
 */

import { useMemo } from 'react';
import type { Role } from '../types';

export function useFilteredRoles(
  roles: Role[],
  filters: {
    system?: string; // 'all' | 'system' | 'custom'
    status?: string; // 'all' | 'active' | 'inactive'
  }
) {
  return useMemo(() => {
    return roles.filter((role) => {
      // 시스템 역할 필터
      if (filters.system && filters.system !== 'all') {
        if (filters.system === 'system' && !role.is_system) return false;
        if (filters.system === 'custom' && role.is_system) return false;
      }

      // 상태 필터
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active' && !role.is_active) return false;
        if (filters.status === 'inactive' && role.is_active) return false;
      }

      return true;
    });
  }, [roles, filters]);
}
