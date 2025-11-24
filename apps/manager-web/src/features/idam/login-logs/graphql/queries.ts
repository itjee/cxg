/**
 * @file queries.ts
 * @description Login Logs GraphQL Queries
 *
 * 로그인 이력 조회 쿼리 정의
 *
 * 타입 정의는 ../types/login-logs.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  LoginLogsQueryVariables,
  LoginLogQueryVariables,
} from "../types/login-logs.types";

/**
 * 로그인 이력 목록 조회 (페이지네이션 포함)
 */
export const GET_LOGIN_LOGS = gql`
  query GetLoginLogs(
    $limit: Int
    $offset: Int
    $search: String
    $attemptType: String
    $success: Boolean
    $userId: ID
    $startDate: String
    $endDate: String
  ) {
    loginLogsConnection(
      limit: $limit
      offset: $offset
      search: $search
      attemptType: $attemptType
      success: $success
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    ) {
      total
      items {
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
      }
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
    }
  }
`;
