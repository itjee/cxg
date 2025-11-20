/**
 * @file queries.ts
 * @description 구독 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 구독 목록 조회 쿼리
 *
 * @query subscriptions
 * @param limit - 조회할 구독 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param tenant_id - 테넌트 ID (선택)
 * @param plan_id - 구독 계획 ID (선택)
 * @param status - 상태 필터 (선택)
 * @param billing_cycle - 청구 주기 필터 (선택)
 * @param auto_renewal - 자동 갱신 필터 (선택)
 * @param is_deleted - 삭제 여부 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 구독 목록 배열
 */
export const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions(
    $limit: Int!
    $offset: Int!
    $tenant_id: String
    $plan_id: String
    $status: String
    $billing_cycle: String
    $auto_renewal: Boolean
    $is_deleted: Boolean
    $search: String
  ) {
    subscriptions(
      limit: $limit
      offset: $offset
      tenant_id: $tenant_id
      plan_id: $plan_id
      status: $status
      billing_cycle: $billing_cycle
      auto_renewal: $auto_renewal
      is_deleted: $is_deleted
      search: $search
    ) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      plan_id
      start_date
      close_date
      billing_cycle
      max_users
      max_storage
      max_api_calls
      base_amount
      user_amount
      currency
      auto_renewal
      noti_renewal
      status
      is_deleted
    }
  }
`;

/**
 * 구독 상세 조회 쿼리
 *
 * @query subscription
 * @param id - 구독 ID (UUID)
 * @returns 구독 상세 정보
 */
export const GET_SUBSCRIPTION = gql`
  query GetSubscription($id: ID!) {
    subscription(id: $id) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      plan_id
      start_date
      close_date
      billing_cycle
      max_users
      max_storage
      max_api_calls
      base_amount
      user_amount
      currency
      auto_renewal
      noti_renewal
      status
      is_deleted
    }
  }
`;

/**
 * 구독 생성 뮤테이션
 *
 * @mutation createSubscription
 * @param input - 구독 생성 입력 데이터
 * @returns 생성된 구독 정보
 */
export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: ManagerSubscriptionCreateInput!) {
    createSubscription(input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      plan_id
      start_date
      close_date
      billing_cycle
      max_users
      max_storage
      max_api_calls
      base_amount
      user_amount
      currency
      auto_renewal
      noti_renewal
      status
      is_deleted
    }
  }
`;

/**
 * 구독 수정 뮤테이션
 *
 * @mutation updateSubscription
 * @param id - 구독 ID (UUID)
 * @param input - 구독 수정 입력 데이터
 * @returns 수정된 구독 정보
 */
export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($id: ID!, $input: ManagerSubscriptionUpdateInput!) {
    updateSubscription(id: $id, input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      plan_id
      start_date
      close_date
      billing_cycle
      max_users
      max_storage
      max_api_calls
      base_amount
      user_amount
      currency
      auto_renewal
      noti_renewal
      status
      is_deleted
    }
  }
`;

/**
 * 구독 삭제 뮤테이션
 *
 * @mutation deleteSubscription
 * @param id - 구독 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_SUBSCRIPTION = gql`
  mutation DeleteSubscription($id: ID!) {
    deleteSubscription(id: $id) {
      success
      message
    }
  }
`;
