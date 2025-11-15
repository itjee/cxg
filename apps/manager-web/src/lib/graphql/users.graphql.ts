/**
 * @file users.graphql.ts
 * @description Manager IDAM Users GraphQL queries and mutations (Apollo Client)
 */

import { gql } from "@apollo/client";

/**
 * 사용자 목록 조회 쿼리
 */
export const GET_USERS = gql`
  query GetUsers(
    $limit: Int
    $offset: Int
    $userType: String
    $status: String
  ) {
    Users(
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
 * 사용자 단건 조회 쿼리
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
      roles {
        id
        code
        name
        description
        category
        level
        scope
      }
      permissions {
        id
        code
        name
        action
        resource
        category
      }
      sessions(status: "ACTIVE", limit: 5) {
        id
        sessionId
        sessionType
        ipAddress
        lastActivityAt
        expiresAt
        status
        createdAt
      }
    }
  }
`;

/**
 * 사용자 생성 뮤테이션
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: UserCreateInput!) {
    createUser(input: $input) {
      id
      userType
      fullName
      email
      username
      status
      createdAt
    }
  }
`;

/**
 * 사용자 수정 뮤테이션
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      userType
      fullName
      email
      phone
      status
      mfaEnabled
      department
      position
      updatedAt
    }
  }
`;

/**
 * GraphQL 변수 타입 정의
 */
export interface GetUsersVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}

export interface GetUserVariables {
  id: string;
}

export interface CreateUserVariables {
  input: {
    userType: string;
    fullName: string;
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
    fullName?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: string;
    mfaEnabled?: boolean;
  };
}
