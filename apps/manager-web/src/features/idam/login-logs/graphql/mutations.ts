/**
 * @file mutations.ts
 * @description Login Logs GraphQL Mutations
 *
 * 로그인 이력 생성/삭제 뮤테이션 정의
 *
 * 타입 명명 규칙:
 * - 생성 뮤테이션 변수: CreateLoginLogVariables (단수)
 * - 삭제 뮤테이션 변수: DeleteLoginLogVariables (단수)
 */

import { gql } from "@apollo/client";
import type { CreateLoginLogInput } from "../types/login-logs.types";

/**
 * 로그인 이력 생성 (단수)
 */
export const CREATE_LOGIN_LOG = gql`
  mutation CreateLoginLog($input: CreateLoginLogInput!) {
    createLoginLog(input: $input) {
      id
      userId
      userType
      tenantContext
      username
      attemptType
      success
      failureReason
      sessionId
      ipAddress
      userAgent
      countryCode
      city
      mfaUsed
      mfaMethod
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * 로그인 이력 삭제 (단수)
 */
export const DELETE_LOGIN_LOG = gql`
  mutation DeleteLoginLog($id: ID!) {
    deleteLoginLog(id: $id) {
      message
    }
  }
`;

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_LOGIN_LOG 뮤테이션 변수 (단수)
 */
export interface CreateLoginLogVariables {
  input: CreateLoginLogInput;
}

/**
 * DELETE_LOGIN_LOG 뮤테이션 변수 (단수)
 */
export interface DeleteLoginLogVariables {
  id: string;
}
