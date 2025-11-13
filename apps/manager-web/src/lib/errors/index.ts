/**
 * @file index.ts
 * @description 공통 에러 처리 모듈 Export
 * 
 * 모든 feature에서 사용 가능한 에러 처리 유틸리티
 * @example
 * import { ApiError, ApiErrorCode } from '@/lib/errors';
 */

export { ApiError, ApiErrorCode, isApiError, type ApiErrorCodeType } from './api-error';
