/**
 * Code Help Types
 *
 * 코드 헬프 컴포넌트 관련 TypeScript 타입 정의
 */

export type CodeHelpType =
  | "customer"
  | "product"
  | "user"
  | "employee"
  | "common_code"
  | "parent_code";

/**
 * 코드 헬프 검색 결과 아이템
 */
export interface CodeHelpResult {
  id: string;                           // UUID
  code: string;                         // 코드
  name: string;                         // 이름
  description?: string | null;          // 설명
  metadata?: Record<string, any> | null; // 추가 메타데이터
  status: string;                       // 상태
  createdAt?: string | null;            // 생성일시 (ISO 8601)
  updatedAt?: string | null;            // 수정일시
}

/**
 * 코드 헬프 검색 응답
 */
export interface CodeHelpResponse {
  totalCount: number;                   // 전체 개수
  items: CodeHelpResult[];              // 결과 목록
  hasMore: boolean;                     // 다음 페이지 여부
}

/**
 * 코드 헬프 검색 필터
 */
export interface CodeHelpFilters {
  status?: string;                      // 상태 필터
  category?: string;                    // 카테고리
  parentCode?: string;                  // 부모코드 (공통코드 검색 시)
  department?: string;                  // 부서 (사원 검색 시)
  userType?: string;                    // 사용자 유형
  [key: string]: any;                   // 추가 필터
}

/**
 * 코드 헬프 모달 Props
 */
export interface CodeHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchType: CodeHelpType;
  title?: string;                       // 모달 제목
  width?: string;                       // 모달 너비 (예: "600px", "80vw")
  height?: string;                      // 모달 높이 (예: "600px", "80vh")
  onSelect: (item: CodeHelpResult) => void;    // 선택 시 콜백
  multiSelect?: boolean;                // 다중 선택 여부 (기본값: false)
  onMultiSelect?: (items: CodeHelpResult[]) => void; // 다중 선택 콜백
  filters?: CodeHelpFilters;            // 초기 필터
  onFiltersChange?: (filters: CodeHelpFilters) => void;
  allowNewEntry?: boolean;              // 새 항목 추가 버튼 여부
  showMetadata?: boolean;               // 메타데이터 표시 여부
  emptyMessage?: string;                // 검색 결과 없음 메시지
}

/**
 * 코드 헬프 Hook Options
 */
export interface UseCodeHelpOptions {
  searchType: CodeHelpType;
  initialFilters?: CodeHelpFilters;
  pageSize?: number;
  debounceMs?: number;
}

/**
 * 코드 헬프 Hook Return
 */
export interface UseCodeHelpReturn {
  // 데이터
  items: CodeHelpResult[];
  totalCount: number;
  hasMore: boolean;
  selectedItems: CodeHelpResult[];

  // 상태
  loading: boolean;
  error: any;

  // 액션
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
  handleSelect: (item: CodeHelpResult, multiSelect?: boolean) => void;
  clearSelection: () => void;
  handleFiltersChange: (filters: CodeHelpFilters) => void;
  setOffset: (offset: number) => void;

  // 현재 상태값
  searchQuery: string;
  offset: number;
  filters: CodeHelpFilters;
}

/**
 * 코드 헬프 서비스 설정
 */
export interface CodeHelpServiceConfig {
  typeTitle: Record<CodeHelpType, string>;
  typeColumns: Record<CodeHelpType, string[]>;
}

/**
 * 코드 헬프 컬럼 설정
 */
export interface CodeHelpColumnConfig {
  searchType: CodeHelpType;
  showMetadata?: boolean;
}
