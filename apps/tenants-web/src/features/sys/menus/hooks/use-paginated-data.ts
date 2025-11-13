/**
 * @file use-paginated-data.ts
 * @description 데이터 배열을 페이지네이션 파라미터에 따라 분할하는 hook
 */

import { useMemo } from 'react';

/**
 * 데이터를 페이지네이션 설정에 따라 분할
 * 
 * @param data - 원본 데이터 배열
 * @param currentPage - 현재 페이지 (0부터 시작)
 * @param itemsPerPage - 페이지당 항목 수
 * @returns 현재 페이지에 해당하는 데이터 배열
 * 
 * @example
 * ```tsx
 * const paginatedData = usePaginatedData(filteredMenus, 0, 10);
 * ```
 */
export function usePaginatedData<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): T[] {
  return useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);
}
