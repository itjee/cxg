/**
 * @file queries.ts
 * @description Sessions GraphQL Queries
 *
 * 세션 조회 쿼리 정의
 *
 * 타입 정의는 ../types/sessions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { SessionsQueryVariables, SessionQueryVariables } from "../types/sessions.types";

/**
 * 세션 목록 조회 (복수)
 */
export const GET_SESSIONS = gql`
  query GetSessions($limit: Int, $offset: Int, $status: String, $userId: ID, $sessionType: String) {
    sessions(limit: $limit, offset: $offset, status: $status, userId: $userId, sessionType: $sessionType) {
      total
      items {
        id
        sessionId
        userId
        username
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
      username
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
