/**
 * @file executions.types.ts
 * @description Executions TypeScript 타입 정의
 */

/**
 * 워크플로우 실행 상태
 */
export type ExecutionStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELED' 
  | 'TIMEOUT';

/**
 * 트리거 소스
 */
export type TriggerSource = 
  | 'SCHEDULED' 
  | 'EVENT' 
  | 'MANUAL' 
  | 'WEBHOOK';

/**
 * 실행 로그 항목
 */
export interface ExecutionLogItem {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: Record<string, any>;
}

/**
 * Executions 정보
 */
export interface Execution {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  // 워크플로우 연결
  workflow_id: string;
  tenant_id?: string;
  
  // 실행 식별 정보
  execution_id: string;
  trigger_source?: TriggerSource;
  triggered_by?: string;
  
  // 입출력 데이터
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  
  // 실행 상태 추적
  status: ExecutionStatus;
  current_step?: string;
  completed_steps?: string[];
  failed_step?: string;
  
  // 실행 시간 정보
  started_at?: string;
  completed_at?: string;
  duration?: number;
  
  // 오류 및 재시도 정보
  error_message?: string;
  error_details?: Record<string, any>;
  retry_count: number;
  
  // 실행 로그
  execution_logs?: ExecutionLogItem[];
  
  // 리소스 사용량 통계
  cpu_usage?: number;
  memory_usage?: number;
  
  // 상태 관리
  deleted: boolean;
}

/**
 * Executions 생성 요청
 */
export interface CreateExecutionRequest {
  workflow_id: string;
  tenant_id?: string;
  execution_id: string;
  trigger_source?: TriggerSource;
  triggered_by?: string;
  input_data?: Record<string, any>;
}

/**
 * Executions 수정 요청
 */
export interface UpdateExecutionRequest {
  status?: ExecutionStatus;
  current_step?: string;
  completed_steps?: string[];
  failed_step?: string;
  output_data?: Record<string, any>;
  error_message?: string;
  error_details?: Record<string, any>;
  started_at?: string;
  completed_at?: string;
  duration?: number;
  retry_count?: number;
  cpu_usage?: number;
  memory_usage?: number;
}

/**
 * Executions 목록 응답
 */
export interface ExecutionsListResponse {
  items: Execution[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Executions 쿼리 파라미터
 */
export interface ExecutionsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ExecutionStatus;
  trigger_source?: TriggerSource;
  workflow_id?: string;
}
