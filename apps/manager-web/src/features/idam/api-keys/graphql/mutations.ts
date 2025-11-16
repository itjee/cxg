/**
 * @file mutations.ts
 * @description API Keys GraphQL Mutations
 *
 * API 키 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 정의는 ../types/api_keys.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreateApiKeyInput,
  UpdateApiKeyInput,
  CreateApiKeyVariables,
  UpdateApiKeyVariables,
  DeleteApiKeyVariables,
} from "../types/api_keys.types";

/**
 * API 키 생성 (단수)
 */
export const CREATE_API_KEY = gql`
  mutation CreateApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input) {
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
 * API 키 수정 (단수)
 */
export const UPDATE_API_KEY = gql`
  mutation UpdateApiKey($id: ID!, $input: UpdateApiKeyInput!) {
    updateApiKey(id: $id, input: $input) {
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
 * API 키 삭제 (단수)
 */
export const DELETE_API_KEY = gql`
  mutation DeleteApiKey($id: ID!) {
    deleteApiKey(id: $id) {
      message
    }
  }
`;
