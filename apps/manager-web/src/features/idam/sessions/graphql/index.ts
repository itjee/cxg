/**
 * @file index.ts
 * @description Sessions GraphQL Exports
 *
 * Sessions feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: SessionsQueryVariables (복수)
 * - 단일 조회: SessionQueryVariables (단수)
 * - 생성/수정/삭제/폐기: CreateSessionVariables, UpdateSessionVariables, DeleteSessionVariables, RevokeSessionVariables (단수)
 */

export {
  GET_SESSIONS,
  GET_SESSION,
  type SessionsQueryVariables,
  type SessionQueryVariables,
  // 호환성 별칭
  type GetSessionsVariables,
  type GetSessionVariables,
} from "./queries";

export {
  CREATE_SESSION,
  UPDATE_SESSION,
  DELETE_SESSION,
  REVOKE_SESSION,
  REVOKE_USER_SESSIONS,
  type CreateSessionVariables,
  type UpdateSessionVariables,
  type DeleteSessionVariables,
  type RevokeSessionVariables,
  type RevokeUserSessionsVariables,
} from "./mutations";
