/**
 * @file mutations.ts
 * @description Sessions GraphQL Mutations
 *
 * Manager Sessions 생성/수정 뮤테이션 정의
 *
 * 타입 정의는 ../types/sessions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreateSessionInput,
  UpdateSessionInput,
  CreateSessionVariables,
  UpdateSessionVariables,
} from "../types/sessions.types";

/**
 * 사용자 생성 (단수)
 */
export const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    sessions {
      createSession(input: $input) {
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
  }
`;

/**
 * 사용자 수정 (단수)
 */
export const UPDATE_SESSION = gql`
  mutation UpdateSession($id: ID!, $input: UpdateSessionInput!) {
    sessions {
      updateSession(id: $id, input: $input) {
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
  }
`;
