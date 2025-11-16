/**
 * @file queries.ts
 * @description Users GraphQL Queries
 *
 * Manager Users 조회 쿼리 정의
 *
 * 타입 정의는 ../types/users.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { UsersQueryVariables, UserQueryVariables } from "../types/users.types";

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
