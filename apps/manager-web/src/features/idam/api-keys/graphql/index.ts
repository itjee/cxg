/**
 * @file index.ts
 * @description API Keys GraphQL Exports
 *
 * API Keys feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: ApiKeysQueryVariables (복수)
 * - 단일 조회: ApiKeyQueryVariables (단수)
 * - 생성/수정/삭제: CreateApiKeyVariables, UpdateApiKeyVariables, DeleteApiKeyVariables (단수)
 */

export {
  GET_API_KEYS,
  GET_API_KEY,
  type ApiKeysQueryVariables,
  type ApiKeyQueryVariables,
  // 호환성 별칭
  type GetApiKeysVariables,
  type GetApiKeyVariables,
} from "./queries";

export {
  CREATE_API_KEY,
  UPDATE_API_KEY,
  DELETE_API_KEY,
  type CreateApiKeyVariables,
  type UpdateApiKeyVariables,
  type DeleteApiKeyVariables,
} from "./mutations";
