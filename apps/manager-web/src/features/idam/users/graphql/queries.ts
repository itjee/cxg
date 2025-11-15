/**
 * Users GraphQL Queries
 *
 * Manager Users 조회 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 사용자 목록 조회
 */
export const GET_MANAGER_USERS = gql`
  query GetManagerUsers($limit: Int, $offset: Int, $user_type: String, $status: String) {
    managerUsers(limit: $limit, offset: $offset, userType: $user_type, status: $status) {
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
 * 사용자 상세 조회
 */
export const GET_MANAGER_USER = gql`
  query GetManagerUser($id: ID!) {
    managerUser(id: $id) {
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

// ===== 쿼리 변수 타입 =====

export interface GetManagerUsersVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}

export interface GetManagerUserVariables {
  id: string;
}
