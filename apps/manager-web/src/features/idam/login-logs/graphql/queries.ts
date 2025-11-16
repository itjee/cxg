/**
 * @file queries.ts
 * @description Login Logs GraphQL Queries
 *
 * 로그인 이력 조회 쿼리 정의
 *
 * 타입 명명 규칙:
 * - 목록 조회 파라미터: LoginLogsQueryVariables (복수)
 * - 단일 조회 파라미터: LoginLogQueryVariables (단수)
 */

import { gql } from "@apollo/client";
import type { LoginLogsQueryVariables } from "../types/login-logs.types";

/**
 * 로그인 이력 목록 조회 (복수)
 */
export const GET_LOGIN_LOGS = gql`
  query GetLoginLogs($limit: Int, $offset: Int, $search: String, $attemptType: String, $success: Boolean, $userId: ID, $userType: String, $tenantContext: ID, $failureReason: String, $mfaUsed: Boolean, $ipAddress: String, $startDate: String, $endDate: String) {
    loginLogs(limit: $limit, offset: $offset, search: $search, attemptType: $attemptType, success: $success, userId: $userId, userType: $userType, tenantContext: $tenantContext, failureReason: $failureReason, mfaUsed: $mfaUsed, ipAddress: $ipAddress, startDate: $startDate, endDate: $endDate) {
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
 * 로그인 이력 상세 조회 (단수)
 */
export const GET_LOGIN_LOG = gql`
  query GetLoginLog($id: ID!) {
    loginLog(id: $id) {
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

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_LOGIN_LOGS 쿼리 변수 (복수)
 */
export interface LoginLogsQueryVariablesExport extends LoginLogsQueryVariables {}

/**
 * GET_LOGIN_LOG 쿼리 변수 (단수)
 */
export interface LoginLogQueryVariables {
  id: string;
}

// 호환성을 위한 별칭
export type GetLoginLogsVariables = LoginLogsQueryVariablesExport;
export type GetLoginLogVariables = LoginLogQueryVariables;
