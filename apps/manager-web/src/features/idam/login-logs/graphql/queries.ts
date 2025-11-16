/**
 * @file queries.ts
 * @description Login Logs GraphQL Queries
 *
 * 로그인 이력 조회 쿼리 정의
 *
 * 타입 정의는 ../types/login-logs.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { LoginLogsQueryVariables, LoginLogQueryVariables } from "../types/login-logs.types";

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
