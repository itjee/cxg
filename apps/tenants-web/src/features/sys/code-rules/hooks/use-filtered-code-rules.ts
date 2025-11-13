/**
 * useFilteredCodeRules Hook
 * 코드 규칙 필터링 로직
 */

import { useMemo } from 'react';
import type { CodeRule, ResetCycle } from '../types';

export function useFilteredCodeRules(
  codeRules: CodeRule[],
  filters: {
    resetCycle?: ResetCycle | 'all';
    status?: string; // 'all' | 'active' | 'inactive'
  }
) {
  return useMemo(() => {
    return codeRules.filter((codeRule) => {
      // 리셋 주기 필터
      if (filters.resetCycle && filters.resetCycle !== 'all' && codeRule.reset_cycle !== filters.resetCycle) {
        return false;
      }

      // 상태 필터
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active' && !codeRule.is_active) return false;
        if (filters.status === 'inactive' && codeRule.is_active) return false;
      }

      return true;
    });
  }, [codeRules, filters]);
}
