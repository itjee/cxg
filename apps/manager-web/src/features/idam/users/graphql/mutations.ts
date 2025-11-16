/**
 * @file mutations.ts
 * @description Users GraphQL Mutations
 *
 * Manager Users 생성/수정 뮤테이션 정의
 */

import { gql } from "@apollo/client";
import type { CreateUserInput, UpdateUserInput } from "../types/users.types";

/**
 * 사용자 생성 (단수)
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
 * 사용자 수정 (단수)
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

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_USER 뮤테이션 변수 (단수)
 */
export interface CreateUserVariables {
  input: CreateUserInput;
}

/**
 * UPDATE_USER 뮤테이션 변수 (단수)
 */
export interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
}
