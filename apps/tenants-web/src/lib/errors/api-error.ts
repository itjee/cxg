/**
 * @file api-error.ts
 * @description 공통 API 에러 처리 클래스
 * 
 * 모든 feature 모듈에서 공통으로 사용하는 에러 처리 로직
 */

export const ApiErrorCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorCodeType = typeof ApiErrorCode[keyof typeof ApiErrorCode];

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCodeType;
  public readonly context?: string;
  public readonly originalError?: unknown;

  constructor(
    statusCode: number,
    code: ApiErrorCodeType,
    message: string,
    context?: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      context: this.context,
    };
  }

  getUserMessage(): string {
    const messages: Record<ApiErrorCodeType, string> = {
      UNAUTHORIZED: '로그인이 필요합니다',
      FORBIDDEN: '접근 권한이 없습니다',
      VALIDATION_ERROR: '입력값을 확인해주세요',
      INVALID_INPUT: '올바르지 않은 입력값입니다',
      NOT_FOUND: '요청한 데이터를 찾을 수 없습니다',
      ALREADY_EXISTS: '이미 존재하는 데이터입니다',
      CONFLICT: '데이터 충돌이 발생했습니다',
      INTERNAL_ERROR: '서버 오류가 발생했습니다',
      SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다',
      NETWORK_ERROR: '네트워크 연결을 확인해주세요',
      TIMEOUT: '요청 시간이 초과되었습니다',
      UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
    };

    return this.message || messages[this.code] || messages.UNKNOWN_ERROR;
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  static fromAxiosError(error: any, context?: string): ApiError {
    if (!error.response) {
      return new ApiError(
        0,
        ApiErrorCode.NETWORK_ERROR,
        '네트워크 연결을 확인해주세요',
        context,
        error
      );
    }

    const status = error.response?.status || 500;
    const errorCode = error.response?.data?.error || error.response?.data?.code;
    const errorMessage = error.response?.data?.message || error.message;

    let code: ApiErrorCodeType;
    
    if (errorCode && Object.values(ApiErrorCode).includes(errorCode)) {
      code = errorCode as ApiErrorCodeType;
    } else {
      code = mapStatusToErrorCode(status);
    }

    return new ApiError(status, code, errorMessage, context, error);
  }
}

function mapStatusToErrorCode(statusCode: number): ApiErrorCodeType {
  const mapping: Record<number, ApiErrorCodeType> = {
    400: ApiErrorCode.INVALID_INPUT,
    401: ApiErrorCode.UNAUTHORIZED,
    403: ApiErrorCode.FORBIDDEN,
    404: ApiErrorCode.NOT_FOUND,
    409: ApiErrorCode.CONFLICT,
    422: ApiErrorCode.VALIDATION_ERROR,
    500: ApiErrorCode.INTERNAL_ERROR,
    503: ApiErrorCode.SERVICE_UNAVAILABLE,
  };

  return mapping[statusCode] || ApiErrorCode.UNKNOWN_ERROR;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
