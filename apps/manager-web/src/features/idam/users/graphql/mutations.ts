/**
 * Users GraphQL Mutations
 *
 * Manager Users 생성/수정/삭제 뮤테이션 정의
 */

import { gql } from "@apollo/client";

/**
 * 사용자 생성
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
 * 사용자 수정
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
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

// ===== 뮤테이션 변수 타입 =====

export interface CreateUserVariables {
  input: {
    user_type: string;
    full_name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    department?: string;
    position?: string;
  };
}

export interface UpdateUserVariables {
  id: string;
  input: {
    full_name?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: string;
    mfa_enabled?: boolean;
  };
}
