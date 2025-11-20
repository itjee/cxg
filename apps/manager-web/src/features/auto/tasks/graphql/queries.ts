/**
 * @file queries.ts
 * @description 작업 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 작업 목록 조회 쿼리
 *
 * @query tasks
 * @param limit - 조회할 작업 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param task_type - 작업 유형 필터 (선택)
 * @param enabled - 활성화 여부 필터 (선택)
 * @param last_run_status - 마지막 실행 상태 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 작업 목록 배열
 */
export const GET_TASKS = gql`
  query GetTasks(
    $limit: Int!
    $offset: Int!
    $task_type: String
    $enabled: Boolean
    $last_run_status: String
    $search: String
  ) {
    tasks(
      limit: $limit
      offset: $offset
      task_type: $task_type
      enabled: $enabled
      last_run_status: $last_run_status
      search: $search
    ) {
      id
      created_at
      updated_at
      created_by
      updated_by
      task_name
      task_type
      description
      schedule_expression
      timezone
      command
      parameters
      working_directory
      environment_variables
      max_execution_time
      max_instances
      notify_success
      notify_failure
      notify_emails
      next_run_at
      last_run_at
      last_run_status
      last_run_duration
      total_runs
      successful_runs
      failed_runs
      enabled
      deleted
    }
  }
`;

/**
 * 작업 상세 조회 쿼리
 *
 * @query task
 * @param id - 작업 ID (UUID)
 * @returns 작업 상세 정보
 */
export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      created_at
      updated_at
      created_by
      updated_by
      task_name
      task_type
      description
      schedule_expression
      timezone
      command
      parameters
      working_directory
      environment_variables
      max_execution_time
      max_instances
      notify_success
      notify_failure
      notify_emails
      next_run_at
      last_run_at
      last_run_status
      last_run_duration
      total_runs
      successful_runs
      failed_runs
      enabled
      deleted
    }
  }
`;

/**
 * 작업 생성 뮤테이션
 *
 * @mutation createTask
 * @param input - 작업 생성 입력 데이터
 * @returns 생성된 작업 정보
 */
export const CREATE_TASK = gql`
  mutation CreateTask($input: ManagerTaskCreateInput!) {
    createTask(input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      task_name
      task_type
      description
      schedule_expression
      timezone
      command
      parameters
      working_directory
      environment_variables
      max_execution_time
      max_instances
      notify_success
      notify_failure
      notify_emails
      next_run_at
      last_run_at
      last_run_status
      last_run_duration
      total_runs
      successful_runs
      failed_runs
      enabled
      deleted
    }
  }
`;

/**
 * 작업 수정 뮤테이션
 *
 * @mutation updateTask
 * @param id - 작업 ID (UUID)
 * @param input - 작업 수정 입력 데이터
 * @returns 수정된 작업 정보
 */
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: ManagerTaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      task_name
      task_type
      description
      schedule_expression
      timezone
      command
      parameters
      working_directory
      environment_variables
      max_execution_time
      max_instances
      notify_success
      notify_failure
      notify_emails
      next_run_at
      last_run_at
      last_run_status
      last_run_duration
      total_runs
      successful_runs
      failed_runs
      enabled
      deleted
    }
  }
`;

/**
 * 작업 삭제 뮤테이션
 *
 * @mutation deleteTask
 * @param id - 작업 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
    }
  }
`;

/**
 * 작업 즉시 실행 뮤테이션
 *
 * @mutation runTaskNow
 * @param id - 작업 ID (UUID)
 * @returns 실행 결과
 */
export const RUN_TASK_NOW = gql`
  mutation RunTaskNow($id: ID!) {
    runTaskNow(id: $id) {
      success
      message
      execution_id
    }
  }
`;
