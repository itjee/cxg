/**
 * @file index.ts
 * @description Tenants GraphQL Exports
 *
 * Tenants feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/tenants.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { TenantsQueryVariables, CreateTenantVariables } from "../types/tenants.types";
 */

export {
  GET_TENANTS,
  GET_TENANT,
} from "./queries";

export {
  CREATE_TENANT,
  UPDATE_TENANT,
  DELETE_TENANT,
} from "./mutations";
