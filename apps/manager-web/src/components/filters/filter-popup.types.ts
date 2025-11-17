/**
 * @file filter-popup.types.ts
 * @description Jira 스타일 필터 팝업 타입 정의
 *
 * 멀티 선택을 지원하는 고급 필터 팝업
 */

/**
 * 필터 옵션 설정
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * 필터 항목 설정
 */
export interface FilterItemConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

/**
 * 필터 상태 (멀티 선택)
 * key: 필터 항목의 key
 * value: 선택된 값들의 배열 (null이면 선택 안 함)
 */
export type FilterState = Record<string, string[] | null>;

/**
 * 필터 팝업 Props
 */
export interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  items: FilterItemConfig[];
}
