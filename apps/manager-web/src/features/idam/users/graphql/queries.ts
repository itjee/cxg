/**
 * @file queries.ts
 * @description Users GraphQL Queries
 *
 * Manager Users 조회 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 사용자 목록 조회 (복수)
 */
export const GET_USERS = gql`
  query GetUsers(
    $limit: Int
    $offset: Int
    $userType: String
    $status: String
  ) {
    users(
      limit: $limit
      offset: $offset
      userType: $userType
      status: $status
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
export const GET_USER = gql`
  query GetUser($id: ID!) {
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

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_USERS 쿼리 변수 (복수)
 */
export interface UsersQueryVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}

/**
 * GET_USER 쿼리 변수 (단수)
 */
export interface UserQueryVariables {
  id: string;
}
