/**
 * @file tasks.types.ts
 * @description Tasks TypeScript 타입 정의
 */

/**
 * 작업 유형
 */
export type TaskType = 
  | 'SYSTEM_CLEANUP' 
  | 'DATA_SYNC' 
  | 'REPORT_GENERATION' 
  | 'BACKUP' 
  | 'MAINTENANCE' 
  | 'MONITORING';

/**
 * 마지막 실행 상태
 */
export type LastRunStatus = 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'TIMEOUT' 
  | 'CANCELED';

/**
 * Tasks 정보
 */
export interface Task {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  // 작업 기본 정보
  task_name: string;
  task_type: TaskType;
  description?: string;
  
  // 스케줄 설정
  schedule_expression: string;
  timezone: string;
  
  // 실행 설정
  command?: string;
  parameters?: Record<string, any>;
  working_directory?: string;
  environment_variables?: Record<string, any>;
  
  // 실행 제한 설정
  max_execution_time: number;
  max_instances: number;
  
  // 알림 설정
  notify_success: boolean;
  notify_failure: boolean;
  notify_emails?: string[];
  
  // 실행 스케줄 정보
  next_run_at?: string;
  last_run_at?: string;
  last_run_status?: LastRunStatus;
  last_run_duration?: number;
  
  // 실행 통계
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  
  // 상태 관리
  enabled: boolean;
  deleted: boolean;
}

/**
 * Tasks 생성 요청
 */
export interface CreateTaskRequest {
  task_name: string;
  task_type: TaskType;
  description?: string;
  schedule_expression: string;
  timezone?: string;
  command?: string;
  parameters?: Record<string, any>;
  working_directory?: string;
  environment_variables?: Record<string, any>;
  max_execution_time?: number;
  max_instances?: number;
  notify_success?: boolean;
  notify_failure?: boolean;
  notify_emails?: string[];
  enabled?: boolean;
}

/**
 * Tasks 수정 요청
 */
export interface UpdateTaskRequest {
  task_name?: string;
  task_type?: TaskType;
  description?: string;
  schedule_expression?: string;
  timezone?: string;
  command?: string;
  parameters?: Record<string, any>;
  working_directory?: string;
  environment_variables?: Record<string, any>;
  max_execution_time?: number;
  max_instances?: number;
  notify_success?: boolean;
  notify_failure?: boolean;
  notify_emails?: string[];
  enabled?: boolean;
}

/**
 * Tasks 목록 응답
 */
export interface TasksListResponse {
  items: Task[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Tasks 쿼리 파라미터
 */
export interface TasksQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  task_type?: TaskType;
  enabled?: boolean;
  last_run_status?: LastRunStatus;
}
