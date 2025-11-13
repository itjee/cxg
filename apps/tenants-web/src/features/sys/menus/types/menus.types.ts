/**
 * @file menus.types.ts
 * @description 메뉴 관리 관련 타입 정의 (sys.menus 테이블 기반)
 */

/**
 * 메뉴 타입
 */
export type MenuType = 'MENU' | 'FOLDER' | 'LINK' | 'DIVIDER';

/**
 * 아이콘 타입
 */
export type IconType = 'lucide' | 'fontawesome' | 'material' | 'custom';

/**
 * 모듈 코드
 */
export type ModuleCode = 
  | 'ADM' | 'ASM' | 'BIM' | 'COM' | 'CRM' 
  | 'CSM' | 'FAM' | 'FIM' | 'HRM' | 'IVM' 
  | 'LWM' | 'PIM' | 'PSM' | 'SRM' | 'SYS' | 'WMS';

/**
 * 메뉴 정보 (DB 스키마 기반)
 */
export interface Menu {
  // 기본 식별자 및 감사 필드
  id: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  created_by?: string; // UUID (NULL 가능)
  updated_at?: string; // TIMESTAMP WITH TIME ZONE
  updated_by?: string; // UUID

  // 메뉴 기본 정보
  code: string; // VARCHAR(100)
  name: string; // VARCHAR(200)
  name_en?: string; // VARCHAR(200)
  description?: string; // TEXT

  // 계층 구조
  parent_id?: string; // UUID (NULL이면 최상위)
  depth: number; // INTEGER (0: 최상위)
  sort_order: number; // INTEGER
  path?: string; // TEXT

  // 메뉴 타입 및 속성
  menu_type: MenuType; // VARCHAR(20)
  module_code?: ModuleCode; // VARCHAR(50)

  // 라우팅 정보
  route_path?: string; // VARCHAR(500)
  component_path?: string; // VARCHAR(500)
  external_url?: string; // VARCHAR(1000)

  // UI 표시 정보
  icon?: string; // VARCHAR(100)
  icon_type?: IconType; // VARCHAR(20)
  badge_text?: string; // VARCHAR(50)
  badge_color?: string; // VARCHAR(20)

  // 권한 설정
  permission_code?: string; // VARCHAR(100)
  is_public: boolean; // BOOLEAN

  // 표시 옵션
  is_visible: boolean; // BOOLEAN
  is_favorite: boolean; // BOOLEAN
  open_in_new_tab: boolean; // BOOLEAN

  // 상태 관리
  is_active: boolean; // BOOLEAN
  is_deleted: boolean; // BOOLEAN

  // 메타 데이터
  meta_data?: Record<string, any>; // JSONB

  // 조인 필드 (응답용)
  parent_name?: string; // 부모 메뉴명
  children?: Menu[]; // 자식 메뉴 목록 (계층 구조)
}

/**
 * 메뉴 생성 요청
 */
export interface CreateMenuRequest {
  code: string;
  name: string;
  name_en?: string;
  description?: string;
  parent_id?: string;
  depth?: number;
  sort_order?: number;
  path?: string;
  menu_type: MenuType;
  module_code?: ModuleCode;
  route_path?: string;
  component_path?: string;
  external_url?: string;
  icon?: string;
  icon_type?: IconType;
  badge_text?: string;
  badge_color?: string;
  permission_code?: string;
  is_public?: boolean;
  is_visible?: boolean;
  is_favorite?: boolean;
  open_in_new_tab?: boolean;
  meta_data?: Record<string, any>;
}

/**
 * 메뉴 수정 요청
 */
export interface UpdateMenuRequest {
  code?: string;
  name?: string;
  name_en?: string;
  description?: string;
  parent_id?: string;
  depth?: number;
  sort_order?: number;
  path?: string;
  menu_type?: MenuType;
  module_code?: ModuleCode;
  route_path?: string;
  component_path?: string;
  external_url?: string;
  icon?: string;
  icon_type?: IconType;
  badge_text?: string;
  badge_color?: string;
  permission_code?: string;
  is_public?: boolean;
  is_visible?: boolean;
  is_favorite?: boolean;
  open_in_new_tab?: boolean;
  is_active?: boolean;
  meta_data?: Record<string, any>;
}

/**
 * 메뉴 목록 응답
 */
export interface MenuListResponse {
  data: Menu[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 메뉴 상세 응답
 */
export interface MenuDetailResponse {
  data: Menu;
}

/**
 * 메뉴 조회 파라미터
 */
export interface MenuQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  menuType?: MenuType;
  moduleCode?: ModuleCode;
  parentId?: string;
  depth?: number;
  isVisible?: boolean;
  isActive?: boolean;
}

/**
 * 메뉴 트리 노드 (계층 구조 표시용)
 */
export interface MenuTreeNode extends Menu {
  children: MenuTreeNode[];
  level: number;
  hasChildren: boolean;
  isExpanded?: boolean;
}
