/**
 * @file queries.ts
 * @description Sessions GraphQL Queries
 *
 * Manager Sessions 조회 쿼리 정의
 *
 * 타입 정의는 ../types/sessions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  SessionsQueryVariables,
  SessionQueryVariables,
} from "../types/sessions.types";

/**
 * 사용자 목록 조회 (복수)
 */
export const GET_SESSIONS = gql`
  query GetSessions(
    $limit: Int
    $offset: Int
    $userType: String
    $status: String
    $search: String
  ) {
    sessions(
      limit: $limit
      offset: $offset
      userType: $userType
      status: $status
      search: $search
    ) {
      id
      userType
      fullName
      email
      phone
      username
      ssoProvider
      ssoSubject
      mfaEnabled
      status
      lastLoginAt
      lastLoginIp
      failedLoginAttempts
      forcePasswordChange
      timezone
      locale
      department
      position
      createdAt
      updatedAt
    }
  }
`;

/**
 * 사용자 상세 조회 (단수)
 */
export const GET_SESSION = gql`
  query GetSession($id: ID!) {
    user(id: $id) {
      id
      userType
      fullName
      email
      phone
      username
      ssoProvider
      ssoSubject
      mfaEnabled
      status
      lastLoginAt
      lastLoginIp
      failedLoginAttempts
      forcePasswordChange
      timezone
      locale
      department
      position
      createdAt
      updatedAt
    }
  }
`;
