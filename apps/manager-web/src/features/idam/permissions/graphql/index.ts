/**
 * @file index.ts
 * @description Permissions GraphQL Exports
 *
 * Permissions feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/permissions.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { PermissionsQueryVariables, CreatePermissionVariables } from "../types/permissions.types";
 */

export {
  GET_PERMISSIONS,
  GET_PERMISSION,
} from "./queries";

export {
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
} from "./mutations";
