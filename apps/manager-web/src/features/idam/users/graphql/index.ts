/**
 * @file index.ts
 * @description Users GraphQL Exports
 *
 * Users feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/users.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { UsersQueryVariables, CreateUserVariables } from "../types/users.types";
 */

export {
  GET_USERS,
  GET_USER,
} from "./queries";

export {
  CREATE_USER,
  UPDATE_USER,
} from "./mutations";
