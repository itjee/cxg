/**
 * @file permissions.types.ts
 * @description 권한(Permission) GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회, 단일 모델 타입: 단수형 (Permission)
 * - 목록 조회, 목록 파라미터: 복수형 (PermissionsQueryVariables)
 * - Create/Update Input: 단수형 (CreatePermissionInput, UpdatePermissionInput)
 */

// ===== 단일 권한 타입 (단수) =====

/**
 * Manager 권한 (GraphQL 필드는 camelCase)
 *
 * @singular 단일 조회, 단일 엔티티 타입
 */
export interface Permission {
  // 기본 식별자 및 감사 필드
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;

  // 권한 기본 정보
  code: string; // 예: "users.create", "tenants.manage"
  name: string;
  description?: string;

  // 권한 분류
  category: string; // 예: "사용자 관리", "시스템 설정"
  resource: string; // 예: "users", "roles", "tenants"
  action: string; // CREATE, READ, UPDATE, DELETE, LIST, MANAGE

  // 권한 범위 및 적용 대상
  scope: string; // GLOBAL, TENANT
  appliesTo: string; // ALL, MASTER, TENANT, SYSTEM

  // 메타데이터
  isSystem: boolean;
  isHidden: boolean;

  status: "ACTIVE" | "INACTIVE"; // ACTIVE, INACTIVE
  isDeleted: boolean;
}

// ===== Create/Update Input 타입 (단수) =====

/**
 * 권한 생성 입력
 */
export interface CreatePermissionInput {
  code: string;
  name: string;
  description?: string;
  category: string;
  resource: string;
  action: string;
  scope?: string;
  appliesTo?: string;
  isSystem?: boolean;
  isHidden?: boolean;
  status: "ACTIVE" | "INACTIVE";
}

/**
 * 권한 수정 입력
 */
export interface UpdatePermissionInput {
  name: string;
  description?: string;
  category: string;
  resource: string;
  action: string;
  scope?: string;
  appliesTo?: string;
  isSystem?: boolean;
  isHidden?: boolean;
  status: "ACTIVE" | "INACTIVE";
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * 권한 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface PermissionsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  category?: string;
  resource?: string;
  action?: string;
  scope?: string;
  isSystem?: boolean;
}

/**
 * 권한 상세 조회 파라미터
 *
 * @singular 단수 조회 파라미터
 */
export interface PermissionQueryVariables {
  id: string;
}

// ===== 뮤테이션 변수 타입 (단수) =====

/**
 * 권한 생성 뮤테이션 변수 (단수)
 */
export interface CreatePermissionVariables {
  input: CreatePermissionInput;
}

/**
 * 권한 수정 뮤테이션 변수 (단수)
 */
export interface UpdatePermissionVariables {
  id: string;
  input: UpdatePermissionInput;
}

/**
 * 권한 삭제 뮤테이션 변수 (단수)
 */
export interface DeletePermissionVariables {
  id: string;
}

// ===== GraphQL 응답 타입 =====

/**
 * 권한 목록 조회 응답
 */
export interface GetPermissionsResponse {
  permissions: Permission[];
}

/**
 * 권한 상세 조회 응답
 */
export interface GetPermissionResponse {
  permission: Permission;
}

/**
 * 권한 생성 응답
 */
export interface CreatePermissionResponse {
  createPermission: Permission;
}

/**
 * 권한 수정 응답
 */
export interface UpdatePermissionResponse {
  updatePermission: Permission;
}

/**
 * 권한 삭제 응답
 */
export interface DeletePermissionResponse {
  deletePermission: { message: string };
}
