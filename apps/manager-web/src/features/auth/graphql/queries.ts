/**
 * Auth GraphQL Queries
 *
 * 인증 관련 GraphQL 쿼리 정의
 * - me: 현재 로그인한 사용자 정보 조회
 */

import { gql } from '@apollo/client';

/**
 * 현재 사용자 정보 조회 쿼리
 *
 * 로그인한 사용자의 프로필 정보를 조회합니다.
 * 인증이 필요합니다.
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      fullName
      userType
      status
      createdAt
    }
  }
`;

// ===== Type definitions for queries =====

export interface ManagerAuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  status: string;
  createdAt: string;
}

export interface GetCurrentUserResponse {
  me: ManagerAuthUser;
}
