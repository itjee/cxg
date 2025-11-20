/**
 * @file queries.ts
 * @description 워크플로우 실행 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 실행 목록 조회 쿼리
 *
 * @query executions
 * @param limit - 조회할 실행 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param workflow_id - 워크플로우 ID (선택)
 * @param status - 상태 필터 (선택)
 * @param trigger_source - 트리거 소스 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 실행 목록 배열
 */
export const GET_EXECUTIONS = gql`
  query GetExecutions(
    $limit: Int!
    $offset: Int!
    $workflow_id: String
    $status: String
    $trigger_source: String
    $search: String
  ) {
    executions(
      limit: $limit
      offset: $offset
      workflow_id: $workflow_id
      status: $status
      trigger_source: $trigger_source
      search: $search
    ) {
      id
      created_at
      updated_at
      created_by
      updated_by
      workflow_id
      tenant_id
      execution_id
      trigger_source
      triggered_by
      input_data
      output_data
      status
      current_step
      completed_steps
      failed_step
      started_at
      completed_at
      duration
      error_message
      error_details
      retry_count
      cpu_usage
      memory_usage
      deleted
    }
  }
`;

/**
 * 실행 상세 조회 쿼리
 *
 * @query execution
 * @param id - 실행 ID (UUID)
 * @returns 실행 상세 정보
 */
export const GET_EXECUTION = gql`
  query GetExecution($id: ID!) {
    execution(id: $id) {
      id
      created_at
      updated_at
      created_by
      updated_by
      workflow_id
      tenant_id
      execution_id
      trigger_source
      triggered_by
      input_data
      output_data
      status
      current_step
      completed_steps
      failed_step
      started_at
      completed_at
      duration
      error_message
      error_details
      retry_count
      cpu_usage
      memory_usage
      deleted
    }
  }
`;

/**
 * 실행 생성 뮤테이션
 *
 * @mutation createExecution
 * @param input - 실행 생성 입력 데이터
 * @returns 생성된 실행 정보
 */
export const CREATE_EXECUTION = gql`
  mutation CreateExecution($input: ManagerExecutionCreateInput!) {
    createExecution(input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      workflow_id
      tenant_id
      execution_id
      trigger_source
      triggered_by
      input_data
      output_data
      status
      current_step
      completed_steps
      failed_step
      started_at
      completed_at
      duration
      error_message
      error_details
      retry_count
      cpu_usage
      memory_usage
      deleted
    }
  }
`;

/**
 * 실행 수정 뮤테이션
 *
 * @mutation updateExecution
 * @param id - 실행 ID (UUID)
 * @param input - 실행 수정 입력 데이터
 * @returns 수정된 실행 정보
 */
export const UPDATE_EXECUTION = gql`
  mutation UpdateExecution($id: ID!, $input: ManagerExecutionUpdateInput!) {
    updateExecution(id: $id, input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      workflow_id
      tenant_id
      execution_id
      trigger_source
      triggered_by
      input_data
      output_data
      status
      current_step
      completed_steps
      failed_step
      started_at
      completed_at
      duration
      error_message
      error_details
      retry_count
      cpu_usage
      memory_usage
      deleted
    }
  }
`;

/**
 * 실행 삭제 뮤테이션
 *
 * @mutation deleteExecution
 * @param id - 실행 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_EXECUTION = gql`
  mutation DeleteExecution($id: ID!) {
    deleteExecution(id: $id) {
      success
      message
    }
  }
`;

/**
 * 실행 재시도 뮤테이션
 *
 * @mutation retryExecution
 * @param id - 실행 ID (UUID)
 * @returns 재시도된 실행 정보
 */
export const RETRY_EXECUTION = gql`
  mutation RetryExecution($id: ID!) {
    retryExecution(id: $id) {
      id
      created_at
      updated_at
      created_by
      updated_by
      workflow_id
      tenant_id
      execution_id
      trigger_source
      triggered_by
      input_data
      output_data
      status
      current_step
      completed_steps
      failed_step
      started_at
      completed_at
      duration
      error_message
      error_details
      retry_count
      cpu_usage
      memory_usage
      deleted
    }
  }
`;
