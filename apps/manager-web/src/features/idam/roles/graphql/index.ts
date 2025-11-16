/**
 * @file index.ts
 * @description Roles GraphQL Exports
 *
 * Roles feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: RolesQueryVariables (복수)
 * - 단일 조회: RoleQueryVariables (단수)
 * - 생성/수정/삭제: CreateRoleVariables, UpdateRoleVariables, DeleteRoleVariables (단수)
 */

export {
  GET_ROLES,
  GET_ROLE,
  type RolesQueryVariables,
  type RoleQueryVariables,
} from "./queries";

export {
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  type CreateRoleVariables,
  type UpdateRoleVariables,
  type DeleteRoleVariables,
} from "./mutations";
