/**
 * @file index.ts
 * @description Login Logs GraphQL Exports
 *
 * Login Logs feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: LoginLogsQueryVariables (복수)
 * - 단일 조회: LoginLogQueryVariables (단수)
 * - 생성/삭제: CreateLoginLogVariables, DeleteLoginLogVariables (단수)
 */

export {
  GET_LOGIN_LOGS,
  GET_LOGIN_LOG,
  type LoginLogsQueryVariables,
  type LoginLogQueryVariables,
  // 호환성 별칭
  type GetLoginLogsVariables,
  type GetLoginLogVariables,
} from "./queries";

export {
  CREATE_LOGIN_LOG,
  DELETE_LOGIN_LOG,
  type CreateLoginLogVariables,
  type DeleteLoginLogVariables,
} from "./mutations";
