/**
 * @file queries.ts
 * @description Sessions GraphQL Queries
 *
 * 세션 조회 쿼리 정의
 *
 * 타입 명명 규칙:
 * - 목록 조회 파라미터: SessionsQueryVariables (복수)
 * - 단일 조회 파라미터: SessionQueryVariables (단수)
 */

import { gql } from "@apollo/client";
import type { SessionsQueryVariables } from "../types/sessions.types";

/**
 * 세션 목록 조회 (복수)
 */
export const GET_SESSIONS = gql`
  query GetSessions($limit: Int, $offset: Int, $status: String, $search: String, $userId: ID, $sessionType: String, $tenantContext: ID, $fingerprint: String, $ipAddress: String, $mfaVerified: Boolean) {
    sessions(limit: $limit, offset: $offset, status: $status, search: $search, userId: $userId, sessionType: $sessionType, tenantContext: $tenantContext, fingerprint: $fingerprint, ipAddress: $ipAddress, mfaVerified: $mfaVerified) {
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
 * 세션 상세 조회 (단수)
 */
export const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
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

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_SESSIONS 쿼리 변수 (복수)
 */
export interface SessionsQueryVariablesExport extends SessionsQueryVariables {}

/**
 * GET_SESSION 쿼리 변수 (단수)
 */
export interface SessionQueryVariables {
  id: string;
}

// 호환성을 위한 별칭
export type GetSessionsVariables = SessionsQueryVariablesExport;
export type GetSessionVariables = SessionQueryVariables;
