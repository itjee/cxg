/**
 * @file mutations.ts
 * @description Sessions GraphQL Mutations
 *
 * 세션 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 정의는 ../types/sessions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreateSessionInput,
  UpdateSessionInput,
  CreateSessionVariables,
  UpdateSessionVariables,
  DeleteSessionVariables,
  RevokeSessionVariables,
  RevokeUserSessionsVariables,
} from "../types/sessions.types";

/**
 * 세션 생성 (단수)
 */
export const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
      id
      sessionId
      userId
      tenantContext
      sessionType
      fingerprint
      userAgent
      ipAddress
      countryCode
      city
      status
      expiresAt
      lastActivityAt
      mfaVerified
      mfaVerifiedAt
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * 세션 수정 (단수)
 */
export const UPDATE_SESSION = gql`
  mutation UpdateSession($id: ID!, $input: UpdateSessionInput!) {
    updateSession(id: $id, input: $input) {
      id
      sessionId
      userId
      tenantContext
      sessionType
      fingerprint
      userAgent
      ipAddress
      countryCode
      city
      status
      expiresAt
      lastActivityAt
      mfaVerified
      mfaVerifiedAt
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * 세션 삭제 (단수)
 */
export const DELETE_SESSION = gql`
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      message
    }
  }
`;

/**
 * 세션 폐기 (Revoke) (단수)
 */
export const REVOKE_SESSION = gql`
  mutation RevokeSession($id: ID!) {
    revokeSession(id: $id) {
      id
      status
    }
  }
`;

/**
 * 사용자의 모든 세션 폐기 (단수 userId)
 */
export const REVOKE_USER_SESSIONS = gql`
  mutation RevokeUserSessions($userId: ID!) {
    revokeUserSessions(userId: $userId) {
      message
    }
  }
`;
