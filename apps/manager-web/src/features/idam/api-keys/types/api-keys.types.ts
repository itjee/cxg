/**
 * @file api-keys.types.ts
 * @description API Key GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회, 단일 모델 타입: 단수형 (ApiKey)
 * - 목록 조회, 목록 파라미터: 복수형 (ApiKeysQueryVariables)
 * - Create/Update Input: 단수형 (CreateApiKeyInput, UpdateApiKeyInput)
 */

// ===== API 키 상태 타입 =====

/**
 * API 키 상태
 */
export type ApiKeyStatus = "ACTIVE" | "INACTIVE" | "REVOKED";

// ===== 단일 API 키 타입 (단수) =====

/**
 * API Key (Identity & Access Management)
 * GraphQL 필드는 camelCase입니다
 *
 * @singular 단일 조회, 단일 엔티티 타입
 */
export interface ApiKey {
  // 기본 식별자 및 메타데이터
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;

  // API 키 정보
  keyId: string;
  keyName: string;

  // 소유자 정보
  userId: string;
  tenantContext?: string;
  serviceAccount?: string;

  // 권한 및 스코프
  scopes?: string[];
  allowedIps?: string[];

  // 사용 제한
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  rateLimitPerDay: number;

  // 상태 및 만료
  status: ApiKeyStatus;
  expiresAt?: string;

  // 사용 통계
  lastUsedAt?: string;
  lastUsedIp?: string;
  usageCount: number;
}

// ===== Create/Update Input 타입 (단수) =====

/**
 * API 키 생성 입력
 */
export interface CreateApiKeyInput {
  keyName: string;
  userId: string;
  tenantContext?: string;
  serviceAccount?: string;
  scopes?: string[];
  allowedIps?: string[];
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  rateLimitPerDay?: number;
  expiresAt?: string;
}

/**
 * API 키 수정 입력
 */
export interface UpdateApiKeyInput {
  keyName?: string;
  scopes?: string[];
  allowedIps?: string[];
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  rateLimitPerDay?: number;
  status?: string;
  expiresAt?: string;
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * API 키 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface ApiKeysQueryVariables {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
}

/**
 * API 키 상세 조회 파라미터
 *
 * @singular 단수 조회 파라미터
 */
export interface ApiKeyQueryVariables {
  id: string;
}

// ===== 뮤테이션 변수 타입 (단수) =====

/**
 * API 키 생성 뮤테이션 변수 (단수)
 */
export interface CreateApiKeyVariables {
  input: CreateApiKeyInput;
}

/**
 * API 키 수정 뮤테이션 변수 (단수)
 */
export interface UpdateApiKeyVariables {
  id: string;
  input: UpdateApiKeyInput;
}

/**
 * API 키 삭제 뮤테이션 변수 (단수)
 */
export interface DeleteApiKeyVariables {
  id: string;
}

// ===== GraphQL 응답 타입 =====

/**
 * API 키 목록 조회 응답
 */
export interface GetApiKeysResponse {
  apiKeys: ApiKey[];
}

/**
 * API 키 상세 조회 응답
 */
export interface GetApiKeyResponse {
  apiKey: ApiKey;
}

/**
 * API 키 생성 응답
 */
export interface CreateApiKeyResponse {
  createApiKey: ApiKey;
}

/**
 * API 키 수정 응답
 */
export interface UpdateApiKeyResponse {
  updateApiKey: ApiKey;
}

/**
 * API 키 삭제 응답
 */
export interface DeleteApiKeyResponse {
  deleteApiKey: { message: string };
}
