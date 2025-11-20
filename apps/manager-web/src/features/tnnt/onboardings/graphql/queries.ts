/**
 * @file queries.ts
 * @description 온보딩 프로세스 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 온보딩 목록 조회 쿼리
 *
 * @query onboardings
 * @param limit - 조회할 온보딩 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param tenant_id - 테넌트 ID (선택)
 * @param step_name - 단계명 필터 (선택)
 * @param step_status - 단계 상태 필터 (선택)
 * @param status - 레코드 상태 필터 (선택)
 * @param is_deleted - 삭제 여부 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 온보딩 목록 배열
 */
export const GET_ONBOARDINGS = gql`
  query GetOnboardings(
    $limit: Int!
    $offset: Int!
    $tenant_id: String
    $step_name: String
    $step_status: String
    $status: String
    $is_deleted: Boolean
    $search: String
  ) {
    onboardings(
      limit: $limit
      offset: $offset
      tenant_id: $tenant_id
      step_name: $step_name
      step_status: $step_status
      status: $status
      is_deleted: $is_deleted
      search: $search
    ) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      step_name
      step_order
      step_status
      started_at
      completed_at
      error_message
      retry_count
      step_data
      status
      is_deleted
    }
  }
`;

/**
 * 온보딩 상세 조회 쿼리
 *
 * @query onboarding
 * @param id - 온보딩 ID (UUID)
 * @returns 온보딩 상세 정보
 */
export const GET_ONBOARDING = gql`
  query GetOnboarding($id: ID!) {
    onboarding(id: $id) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      step_name
      step_order
      step_status
      started_at
      completed_at
      error_message
      retry_count
      step_data
      status
      is_deleted
    }
  }
`;

/**
 * 온보딩 생성 뮤테이션
 *
 * @mutation createOnboarding
 * @param input - 온보딩 생성 입력 데이터
 * @returns 생성된 온보딩 정보
 */
export const CREATE_ONBOARDING = gql`
  mutation CreateOnboarding($input: ManagerOnboardingCreateInput!) {
    createOnboarding(input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      step_name
      step_order
      step_status
      started_at
      completed_at
      error_message
      retry_count
      step_data
      status
      is_deleted
    }
  }
`;

/**
 * 온보딩 수정 뮤테이션
 *
 * @mutation updateOnboarding
 * @param id - 온보딩 ID (UUID)
 * @param input - 온보딩 수정 입력 데이터
 * @returns 수정된 온보딩 정보
 */
export const UPDATE_ONBOARDING = gql`
  mutation UpdateOnboarding($id: ID!, $input: ManagerOnboardingUpdateInput!) {
    updateOnboarding(id: $id, input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      step_name
      step_order
      step_status
      started_at
      completed_at
      error_message
      retry_count
      step_data
      status
      is_deleted
    }
  }
`;

/**
 * 온보딩 삭제 뮤테이션
 *
 * @mutation deleteOnboarding
 * @param id - 온보딩 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_ONBOARDING = gql`
  mutation DeleteOnboarding($id: ID!) {
    deleteOnboarding(id: $id) {
      success
      message
    }
  }
`;

/**
 * 온보딩 단계 재시도 뮤테이션
 *
 * @mutation retryOnboardingStep
 * @param id - 온보딩 ID (UUID)
 * @returns 재시도된 온보딩 정보
 */
export const RETRY_ONBOARDING_STEP = gql`
  mutation RetryOnboardingStep($id: ID!) {
    retryOnboardingStep(id: $id) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      step_name
      step_order
      step_status
      started_at
      completed_at
      error_message
      retry_count
      step_data
      status
      is_deleted
    }
  }
`;
