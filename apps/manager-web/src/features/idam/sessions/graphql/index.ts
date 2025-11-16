/**
 * @file index.ts
 * @description Sessions GraphQL Exports
 *
 * Sessions feature의 모든 GraphQL 쿼리 및 뮤테이션을 export합니다.
 *
 * ⚠️ 타입 정의는 ../types/sessions.types.ts에서 관리됩니다.
 * 타입을 임포트할 때는 반드시 types.ts에서 직접 임포트하세요.
 *
 * 예시:
 * import type { SessionsQueryVariables, CreateSessionVariables } from "../types/sessions.types";
 */

export {
  GET_SESSIONS,
  GET_SESSION,
} from "./queries";

export {
  CREATE_SESSION,
  UPDATE_SESSION,
  DELETE_SESSION,
  REVOKE_SESSION,
  REVOKE_USER_SESSIONS,
} from "./mutations";
