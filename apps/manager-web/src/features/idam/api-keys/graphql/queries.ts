/**
 * @file queries.ts
 * @description API Keys GraphQL Queries
 *
 * API 키 조회 쿼리 정의
 *
 * 타입 정의는 ../types/api_keys.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { ApiKeysQueryVariables, ApiKeyQueryVariables } from "../types/api_keys.types";

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
