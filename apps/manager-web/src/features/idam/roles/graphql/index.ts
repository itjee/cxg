/**
 * @file index.ts
 * @description Roles GraphQL Exports
 *
 * Roles feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/roles.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { RolesQueryVariables, CreateRoleVariables } from "../types/roles.types";
 */

export {
  GET_ROLES,
  GET_ROLE,
} from "./queries";

export {
  CREATE_ROLE,
  UPDATE_ROLE,
} from "./mutations";
