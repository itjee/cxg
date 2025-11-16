/**
 * @file index.ts
 * @description Login Logs GraphQL Exports
 *
 * Login Logs feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/login-logs.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { LoginLogsQueryVariables, CreateLoginLogVariables } from "../types/login-logs.types";
 */

export {
  GET_LOGIN_LOGS,
  GET_LOGIN_LOG,
} from "./queries";

export {
  CREATE_LOGIN_LOG,
  DELETE_LOGIN_LOG,
} from "./mutations";
