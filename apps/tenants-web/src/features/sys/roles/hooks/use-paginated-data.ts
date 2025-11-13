/**
 * usePaginatedData Hook
 * 페이지네이션 로직 (공통)
 */

import { useMemo } from 'react';

export function usePaginatedData<T>(data: T[], currentPage: number, itemsPerPage: number) {
  return useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);
}
