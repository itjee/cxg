/**
 * Permission Types
 * 권한 관련 타입 정의 (sys.permissions 테이블 기반)
 */

/**
 * 모듈 코드 타입
 */
export type ModuleCode = 'ADM' | 'ASM' | 'BIM' | 'COM' | 'CSM' | 'FIM' | 'IVM' | 'LWM' | 'PSM' | 'SRM' | 'SYS';

/**
 * 액션 타입
 */
export type ActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'IMPORT' | 'EXECUTE';

/**
 * 권한 정보 (DB 스키마 기반)
 */
export interface Permission {
  // 기본 식별자 및 감사 필드
  id: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  created_by?: string; // UUID (NULL 가능)
  updated_at?: string; // TIMESTAMP WITH TIME ZONE
  updated_by?: string; // UUID

  // 권한 정보
  code: string; // VARCHAR(100) - 권한 코드 (예: ADM_USERS_CREATE)
  name: string; // VARCHAR(200) - 권한명
  module_code: ModuleCode; // VARCHAR(50) - 모듈 코드
  resource: string; // VARCHAR(100) - 리소스명
  action: ActionType; // VARCHAR(50) - 액션
  description?: string; // TEXT - 권한 설명

  // 상태 관리
  is_active: boolean; // BOOLEAN - 활성 상태
}

/**
 * 권한 생성 요청
 */
export interface CreatePermissionRequest {
  code: string;
  name: string;
  module_code: ModuleCode;
  resource: string;
  action: ActionType;
  description?: string;
  is_active?: boolean;
}

/**
 * 권한 수정 요청
 */
export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * 권한 목록 응답
 */
export interface PermissionListResponse {
  data: Permission[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 권한 상세 응답
 */
export interface PermissionDetailResponse {
  data: Permission;
}

/**
 * 권한 조회 파라미터
 */
export type PermissionQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  module_code?: ModuleCode;
  is_active?: boolean;
  resource?: string;
  action?: ActionType;
};
