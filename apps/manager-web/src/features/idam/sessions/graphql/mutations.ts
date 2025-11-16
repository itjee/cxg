/**
 * @file mutations.ts
 * @description Sessions GraphQL Mutations
 *
 * 세션 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 명명 규칙:
 * - 생성 뮤테이션 변수: CreateSessionVariables (단수)
 * - 수정 뮤테이션 변수: UpdateSessionVariables (단수)
 * - 삭제 뮤테이션 변수: DeleteSessionVariables (단수)
 * - 폐기 뮤테이션 변수: RevokeSessionVariables (단수)
 */

import { gql } from "@apollo/client";
import type {
  CreateSessionInput,
  UpdateSessionInput,
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

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_SESSION 뮤테이션 변수 (단수)
 */
export interface CreateSessionVariables {
  input: CreateSessionInput;
}

/**
 * UPDATE_SESSION 뮤테이션 변수 (단수)
 */
export interface UpdateSessionVariables {
  id: string;
  input: UpdateSessionInput;
}

/**
 * DELETE_SESSION 뮤테이션 변수 (단수)
 */
export interface DeleteSessionVariables {
  id: string;
}

/**
 * REVOKE_SESSION 뮤테이션 변수 (단수)
 */
export interface RevokeSessionVariables {
  id: string;
}

/**
 * REVOKE_USER_SESSIONS 뮤테이션 변수 (단수)
 */
export interface RevokeUserSessionsVariables {
  userId: string;
}
