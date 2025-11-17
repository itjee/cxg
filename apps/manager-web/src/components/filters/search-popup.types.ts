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
 *
 * 필터 타입:
 * - "checkbox" (기본값): 다중 선택 체크박스
 * - "daterange": 날짜 범위 선택 (from ~ to)
 */
export interface FilterItemConfig {
  key: string;
  label: string;
  type?: "checkbox" | "daterange";
  options: FilterOption[];
}

/**
 * 필터 상태
 * - string[]: 체크박스 필터 (다중 선택)
 * - { type: "range"; value: { from?: string; to?: string } }: 날짜 범위 필터
 * - null: 필터가 선택되지 않은 상태
 */
export type FilterState = Record<
  string,
  string[] | null | { type: string; value: { from?: string; to?: string } }
>;

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
