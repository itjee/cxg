/**
 * @file roles.types.ts
 * @description 역할(Role) GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회/단일 모델: 단수형 (Role, Session, Permission)
 * - 목록 조회/목록 파라미터: 복수형 (Roles, Sessions, Permissions)
 * - Create/Update Input: 단수형 (CreateRoleInput, UpdateRoleInput)
 */

// ===== 단일 역할 타입 =====

/**
 * Manager Role (ID&Access Management)
 * GraphQL 필드는 camelCase입니다
 *
 * @singular 단일 조회, 단일 엔티티 타입
 */
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string; // MANAGER_ADMIN, PLATFORM_SUPPORT, TENANT_ADMIN, TENANT_USER
  level: number;
  scope: string; // GLOBAL, TENANT
  isDefault: boolean;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt?: string;
  // 트렌드 데이터 (선택사항)
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

// ===== Create/Update Input 타입 (단수) =====

/**
 * 역할 생성 입력
 */
export interface CreateRoleInput {
  code: string;
  name: string;
  description?: string;
  category: string;
  level: number;
  scope: string;
  isDefault?: boolean;
  priority?: number;
}

/**
 * 역할 수정 입력
 */
export interface UpdateRoleInput {
  name?: string;
  description?: string;
  level?: number;
  isDefault?: boolean;
  priority?: number;
  status?: string;
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * 역할 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface RolesQueryVariables {
  limit?: number;
  offset?: number;
  status?: string;
  category?: string;
  search?: string;
}

/**
 * 역할 상세 조회 파라미터
 *
 * @singular 단수 조회 파라미터
 */
export interface RoleQueryVariables {
  id: string;
}

// ===== 뮤테이션 변수 타입 (단수) =====

/**
 * 역할 생성 뮤테이션 변수 (단수)
 */
export interface CreateRoleVariables {
  input: CreateRoleInput;
}

/**
 * 역할 수정 뮤테이션 변수 (단수)
 */
export interface UpdateRoleVariables {
  id: string;
  input: UpdateRoleInput;
}

/**
 * 역할 삭제 뮤테이션 변수 (단수)
 */
export interface DeleteRoleVariables {
  id: string;
}

// ===== GraphQL 응답 타입 =====

/**
 * 역할 목록 조회 응답
 */
export interface GetRolesResponse {
  roles: Role[];
}

/**
 * 역할 상세 조회 응답
 */
export interface GetRoleResponse {
  role: Role;
}

/**
 * 역할 생성 응답
 */
export interface CreateRoleResponse {
  createRole: Role;
}

/**
 * 역할 수정 응답
 */
export interface UpdateRoleResponse {
  updateRole: Role;
}

/**
 * 역할 삭제 응답
 */
export interface DeleteRoleResponse {
  deleteRole: { message: string };
}

// ===== UI 필터 상태 타입 =====

/**
 * 역할 필터 상태 (UI 필터 팝업에서 사용)
 *
 * FilterPopup 컴포넌트에서 사용하는 필터 상태 타입 (멀티 선택)
 * - 각 필터는 여러 값을 배열로 저장
 * - null이면 필터가 선택되지 않은 상태
 */
export interface RolesFilterState {
  status: string[] | null;      // ["ACTIVE", "INACTIVE"] 등 여러 상태 선택 가능
  category: string[] | null;    // ["ADMIN", "USER"] 등 여러 카테고리 선택 가능
}
