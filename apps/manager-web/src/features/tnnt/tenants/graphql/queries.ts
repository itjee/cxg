/**
 * @file queries.ts
 * @description 테넌트 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 테넌트 목록 조회 쿼리
 *
 * @query tenants
 * @param limit - 조회할 테넌트 수
 * @param offset - 시작 위치 (페이지네이션)
 * @returns 테넌트 목록 배열
 */
export const GET_TENANTS = gql`
  query GetTenants($limit: Int!, $offset: Int!) {
    tenants(limit: $limit, offset: $offset) {
      id
      code
      name
      domain
      email
      phone
      address
      city
      state
      country
      postal_code
      industry
      size
      status
      is_suspended
      trial_ends_at
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 테넌트 상세 조회 쿼리
 *
 * @query tenant
 * @param id - 테넌트 ID (UUID)
 * @returns 테넌트 상세 정보
 */
export const GET_TENANT = gql`
  query GetTenant($id: ID!) {
    tenant(id: $id) {
      id
      code
      name
      domain
      email
      phone
      address
      city
      state
      country
      postal_code
      industry
      size
      status
      is_suspended
      trial_ends_at
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 테넌트 생성 뮤테이션
 *
 * @mutation createTenant
 * @param input - 테넌트 생성 입력 데이터
 * @returns 생성된 테넌트 정보
 */
export const CREATE_TENANT = gql`
  mutation CreateTenant($input: ManagerTenantCreateInput!) {
    createTenant(input: $input) {
      id
      code
      name
      domain
      email
      phone
      address
      city
      state
      country
      postal_code
      industry
      size
      status
      is_suspended
      trial_ends_at
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 테넌트 수정 뮤테이션
 *
 * @mutation updateTenant
 * @param id - 테넌트 ID (UUID)
 * @param input - 테넌트 수정 입력 데이터
 * @returns 수정된 테넌트 정보
 */
export const UPDATE_TENANT = gql`
  mutation UpdateTenant($id: ID!, $input: ManagerTenantUpdateInput!) {
    updateTenant(id: $id, input: $input) {
      id
      code
      name
      domain
      email
      phone
      address
      city
      state
      country
      postal_code
      industry
      size
      status
      is_suspended
      trial_ends_at
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 테넌트 삭제 뮤테이션
 *
 * @mutation deleteTenant
 * @param id - 테넌트 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_TENANT = gql`
  mutation DeleteTenant($id: ID!) {
    deleteTenant(id: $id) {
      success
      message
    }
  }
`;
