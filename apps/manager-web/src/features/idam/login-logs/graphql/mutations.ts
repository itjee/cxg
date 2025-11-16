/**
 * @file mutations.ts
 * @description Login Logs GraphQL Mutations
 *
 * 로그인 이력 생성/삭제 뮤테이션 정의
 *
 * 타입 정의는 ../types/login-logs.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreateLoginLogInput,
  CreateLoginLogVariables,
  DeleteLoginLogVariables,
} from "../types/login-logs.types";

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
