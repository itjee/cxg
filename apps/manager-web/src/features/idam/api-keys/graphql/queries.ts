/**
 * @file queries.ts
 * @description API Keys GraphQL Queries
 *
 * API 키 조회 쿼리 정의
 *
 * 타입 명명 규칙:
 * - 목록 조회 파라미터: ApiKeysQueryVariables (복수)
 * - 단일 조회 파라미터: ApiKeyQueryVariables (단수)
 */

import { gql } from "@apollo/client";
import type { ApiKeysQueryVariables } from "../types/api_keys.types";

/**
 * API 키 목록 조회 (복수)
 */
export const GET_API_KEYS = gql`
  query GetApiKeys($limit: Int, $offset: Int, $status: String, $search: String) {
    apiKeys(limit: $limit, offset: $offset, status: $status, search: $search) {
      id
      keyId
      keyName
      userId
      tenantContext
      serviceAccount
      scopes
      allowedIps
      rateLimitPerMinute
      rateLimitPerHour
      rateLimitPerDay
      status
      expiresAt
      lastUsedAt
      lastUsedIp
      usageCount
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * API 키 상세 조회 (단수)
 */
export const GET_API_KEY = gql`
  query GetApiKey($id: ID!) {
    apiKey(id: $id) {
      id
      keyId
      keyName
      userId
      tenantContext
      serviceAccount
      scopes
      allowedIps
      rateLimitPerMinute
      rateLimitPerHour
      rateLimitPerDay
      status
      expiresAt
      lastUsedAt
      lastUsedIp
      usageCount
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_API_KEYS 쿼리 변수 (복수)
 */
export interface ApiKeysQueryVariablesExport extends ApiKeysQueryVariables {}

/**
 * GET_API_KEY 쿼리 변수 (단수)
 */
export interface ApiKeyQueryVariables {
  id: string;
}

// 호환성을 위한 별칭
export type GetApiKeysVariables = ApiKeysQueryVariablesExport;
export type GetApiKeyVariables = ApiKeyQueryVariables;
