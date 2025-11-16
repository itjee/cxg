/**
 * @file index.ts
 * @description Permissions GraphQL Exports
 *
 * Permissions feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: PermissionsQueryVariables (복수)
 * - 단일 조회: PermissionQueryVariables (단수)
 * - 생성/수정/삭제: CreatePermissionVariables, UpdatePermissionVariables, DeletePermissionVariables (단수)
 */

export {
  GET_PERMISSIONS,
  GET_PERMISSION,
  type PermissionsQueryVariables,
  type PermissionQueryVariables,
  // 호환성 별칭
  type GetPermissionsVariables,
  type GetPermissionVariables,
} from "./queries";

export {
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  type CreatePermissionVariables,
  type UpdatePermissionVariables,
  type DeletePermissionVariables,
} from "./mutations";
