/**
 * @file roles.types.ts
 * @description 역할(Role) GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회/단일 모델: 단수형 (Role)
 * - 목록 조회/목록 파라미터: 복수형 (Roles, RolesQueryVariables)
 * - Create/Update Input: 단수형 (CreateRoleInput, UpdateRoleInput)
 */

// ===== 단일 역할 타입 (단수) =====

/**
 * Manager Role (Identity & Access Management)
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
  status: string; // ACTIVE, INACTIVE
  createdAt: string;
  updatedAt?: string;
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
