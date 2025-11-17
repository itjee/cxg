/**
 * @file index.ts
 * @description Query 기반 공통 쿼리 조건 컴포넌트 export
 *
 * 아키텍처 (Query 기반 통일):
 * - QueryBar: 쿼리 입력 바 UI (공통)
 * - QueryFilter: 쿼리 조건 관리 (공통)
 * - QueryFilterPopup: Jira 스타일 쿼리 필터 팝업 (멀티 선택)
 * - CheckboxGroup: 체크박스 그룹 (내부)
 * - Filters: 기본 필터 컴포넌트 (Expanded 필터 UI)
 *
 * 용어 정의 (통일됨):
 * - queryText: 자유 검색 텍스트 (텍스트 입력)
 * - queryFilters: 쿼리 필터 조건들 (선택형 옵션)
 * - 둘 다 서버로 전송되는 "쿼리 조건"
 */

// === Query 기반 컴포넌트 ===
export { QueryBar } from "./query-bar";
export { QueryFilter } from "./query-filter";
export { QueryFilterPopup } from "./query-filter-popup";

// === 내부 컴포넌트 ===
export { CheckboxGroup } from "./checkbox-group";

// === 기본 필터 컴포넌트 (Expanded 필터 UI) ===
export { Filters } from "./filters";
export type { FilterConfig, FilterOption, FiltersProps } from "./filters";

// === Query 기반 타입 export ===
export type {
  QueryBarProps,
} from "./query-bar";
export type {
  QueryFilterProps,
  FilterItemConfig,
} from "./query-filter";
export type {
  QueryFilterPopupProps,
  FilterItemConfig as FilterItemConfigPopup,
  FilterOption as FilterOptionPopup,
} from "./filter-popup.types";
