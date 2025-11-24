/**
 * @file index.ts
 * @description Search 기반 공통 검색 조건 컴포넌트 export
 *
 * 아키텍처 (Search 기반 통일):
 * - SearchBar: 검색 입력 바 UI (공통)
 * - SearchFilter: 검색 조건 관리 (공통)
 * - SearchFilterPopup: Jira 스타일 검색 필터 팝업 (멀티 선택)
 * - CheckboxGroup: 체크박스 그룹 (내부)
 * - Filters: 기본 필터 컴포넌트 (Expanded 필터 UI)
 *
 * 용어 정의 (통일됨):
 * - searchText: 자유 검색 텍스트 (텍스트 입력)
 * - searchFilters: 검색 필터 조건들 (선택형 옵션)
 * - 둘 다 서버로 전송되는 "검색 조건"
 */

// === Search 기반 컴포넌트 ===
export { SearchBar } from "./search-bar";
export { SearchFilter } from "./search-filter";
export { SearchFilterPopup } from "./search-filter-popup";

// === 내부 컴포넌트 ===
export { CheckboxGroup } from "./search-checkbox-group";

// === 도메인 특화 모달 ===
export { TenantSearchModal } from "./tenant-search-modal";

// === 기본 필터 컴포넌트 (Expanded 필터 UI) - 삭제됨 ===
// Filters 컴포넌트는 SearchFilterPopup으로 통일되었습니다.

// === Search 기반 타입 export ===
export type {
  SearchBarProps,
} from "./search-bar";
export type {
  SearchFilterProps,
  FilterItemConfig,
} from "./search-filter";
export type {
  SearchFilterPopupProps,
} from "./search-filter-popup";
export type {
  FilterItemConfig as FilterItemConfigPopup,
  FilterOption as FilterOptionPopup,
} from "./search-popup.types";
