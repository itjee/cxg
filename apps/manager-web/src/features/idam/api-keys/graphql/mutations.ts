/**
 * @file mutations.ts
 * @description API Keys GraphQL Mutations
 *
 * API 키 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 명명 규칙:
 * - 생성 뮤테이션 변수: CreateApiKeyVariables (단수)
 * - 수정 뮤테이션 변수: UpdateApiKeyVariables (단수)
 * - 삭제 뮤테이션 변수: DeleteApiKeyVariables (단수)
 */

import { gql } from "@apollo/client";
import type {
  CreateApiKeyInput,
  UpdateApiKeyInput,
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

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_API_KEY 뮤테이션 변수 (단수)
 */
export interface CreateApiKeyVariables {
  input: CreateApiKeyInput;
}

/**
 * UPDATE_API_KEY 뮤테이션 변수 (단수)
 */
export interface UpdateApiKeyVariables {
  id: string;
  input: UpdateApiKeyInput;
}

/**
 * DELETE_API_KEY 뮤테이션 변수 (단수)
 */
export interface DeleteApiKeyVariables {
  id: string;
}
