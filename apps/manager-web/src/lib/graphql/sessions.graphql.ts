/**
 * @file sessions.graphql.ts
 * @description Manager IDAM Sessions GraphQL queries and mutations (Apollo Client)
 */

import { gql } from '@apollo/client';

/**
 * 세션 목록 조회 쿼리
 */
export const GET_MANAGER_SESSIONS = gql`
  query GetManagerSessions($limit: Int, $offset: Int, $userId: ID, $status: String) {
    managerSessions(limit: $limit, offset: $offset, userId: $userId, status: $status) {
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
    }
  }
`;

/**
 * 세션 단건 조회 쿼리
 */
export const GET_MANAGER_SESSION = gql`
  query GetManagerSession($id: ID!) {
    managerSession(id: $id) {
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
      user {
        id
        fullName
        email
        username
        userType
      }
    }
  }
`;

/**
 * 세션 폐기 뮤테이션
 */
export const REVOKE_MANAGER_SESSION = gql`
  mutation RevokeManagerSession($id: ID!) {
    revokeManagerSession(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

/**
 * 세션 삭제 뮤테이션
 */
export const DELETE_MANAGER_SESSION = gql`
  mutation DeleteManagerSession($id: ID!) {
    deleteManagerSession(id: $id)
  }
`;

/**
 * GraphQL 변수 타입 정의
 */
export interface GetManagerSessionsVariables {
  limit?: number;
  offset?: number;
  userId?: string;
  status?: string;
}

export interface GetManagerSessionVariables {
  id: string;
}

export interface RevokeManagerSessionVariables {
  id: string;
}

export interface DeleteManagerSessionVariables {
  id: string;
}
