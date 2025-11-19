/**
 * useCodeHelp Hook
 *
 * 코드 헬프 검색 기능을 제공하는 커스텀 Hook
 */

import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CODE_HELP_SEARCH_QUERY } from "@/shared/graphql/code-help-queries";
import type {
  CodeHelpType,
  CodeHelpResult,
  CodeHelpFilters,
  UseCodeHelpOptions,
  UseCodeHelpReturn,
} from "@/shared/types/code-help.types";

export function useCodeHelp(options: UseCodeHelpOptions): UseCodeHelpReturn {
  const {
    searchType,
    initialFilters = {},
    pageSize = 20,
    debounceMs = 300,
  } = options;

  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 페이지 상태
  const [offset, setOffset] = useState<number>(0);

  // 필터 상태
  const [filters, setFilters] = useState<CodeHelpFilters>(initialFilters);

  // 다중 선택 상태
  const [selectedItems, setSelectedItems] = useState<CodeHelpResult[]>([]);

  // Debounce된 검색어
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

  // 검색어 Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setOffset(0); // 검색어 변경 시 첫 페이지로
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [searchQuery, debounceMs]);

  // GraphQL Query 실행
  const { data, loading, error, fetchMore } = useQuery(CODE_HELP_SEARCH_QUERY, {
    variables: {
      searchType: searchType.toUpperCase(),
      searchQuery: debouncedSearchQuery,
      limit: pageSize,
      offset,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
    skip: false,
  });

  // 다음 페이지 로드
  const loadMore = useCallback(() => {
    if (data?.codeHelp?.hasMore) {
      setOffset((prev) => prev + pageSize);
    }
  }, [data?.codeHelp?.hasMore, pageSize]);

  // 아이템 선택
  const handleSelect = useCallback(
    (item: CodeHelpResult, multiSelect: boolean = false) => {
      if (multiSelect) {
        setSelectedItems((prev) => {
          const isSelected = prev.some((s) => s.id === item.id);
          if (isSelected) {
            return prev.filter((s) => s.id !== item.id);
          }
          return [...prev, item];
        });
      } else {
        setSelectedItems([item]);
      }
    },
    []
  );

  // 선택 초기화
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // 필터 변경
  const handleFiltersChange = useCallback((newFilters: CodeHelpFilters) => {
    setFilters(newFilters);
    setOffset(0);
  }, []);

  return {
    // 데이터
    items: data?.codeHelp?.items || [],
    totalCount: data?.codeHelp?.totalCount || 0,
    hasMore: data?.codeHelp?.hasMore || false,
    selectedItems,

    // 상태
    loading,
    error,

    // 액션
    setSearchQuery,
    loadMore,
    handleSelect,
    clearSelection,
    handleFiltersChange,
    setOffset,

    // 상태값
    searchQuery,
    offset,
    filters,
  };
}
