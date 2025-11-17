/**
 * @file mutations.ts
 * @description Users GraphQL Mutations
 *
 * Manager Users 생성/수정 뮤테이션 정의
 *
 * 타입 정의는 ../types/users.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreateUserInput,
  UpdateUserInput,
  CreateUserVariables,
  UpdateUserVariables,
} from "../types/users.types";

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
