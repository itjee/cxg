/**
 * @file queries.ts
 * @description 테넌트 역할 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 테넌트 역할 목록 조회 쿼리
 *
 * @query tenantRoles
 * @param limit - 조회할 역할 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param tenant_id - 테넌트 ID (선택)
 * @param status - 상태 필터 (선택)
 * @param is_system_role - 시스템 역할 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 테넌트 역할 목록 배열
 */
export const GET_TENANT_ROLES = gql`
  query GetTenantRoles(
    $limit: Int!
    $offset: Int!
    $tenant_id: String
    $status: String
    $is_system_role: Boolean
    $search: String
  ) {
    tenantRoles(
      limit: $limit
      offset: $offset
      tenant_id: $tenant_id
      status: $status
      is_system_role: $is_system_role
      search: $search
    ) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      role_name
      role_code
      description
      permissions
      status
      is_system_role
      is_deleted
    }
  }
`;

/**
 * 테넌트 역할 상세 조회 쿼리
 *
 * @query tenantRole
 * @param id - 테넌트 역할 ID (UUID)
 * @returns 테넌트 역할 상세 정보
 */
export const GET_TENANT_ROLE = gql`
  query GetTenantRole($id: ID!) {
    tenantRole(id: $id) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      role_name
      role_code
      description
      permissions
      status
      is_system_role
      is_deleted
    }
  }
`;

/**
 * 테넌트 역할 생성 뮤테이션
 *
 * @mutation createTenantRole
 * @param input - 테넌트 역할 생성 입력 데이터
 * @returns 생성된 테넌트 역할 정보
 */
export const CREATE_TENANT_ROLE = gql`
  mutation CreateTenantRole($input: ManagerTenantRoleCreateInput!) {
    createTenantRole(input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      role_name
      role_code
      description
      permissions
      status
      is_system_role
      is_deleted
    }
  }
`;

/**
 * 테넌트 역할 수정 뮤테이션
 *
 * @mutation updateTenantRole
 * @param id - 테넌트 역할 ID (UUID)
 * @param input - 테넌트 역할 수정 입력 데이터
 * @returns 수정된 테넌트 역할 정보
 */
export const UPDATE_TENANT_ROLE = gql`
  mutation UpdateTenantRole($id: ID!, $input: ManagerTenantRoleUpdateInput!) {
    updateTenantRole(id: $id, input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      role_name
      role_code
      description
      permissions
      status
      is_system_role
      is_deleted
    }
  }
`;

/**
 * 테넌트 역할 삭제 뮤테이션
 *
 * @mutation deleteTenantRole
 * @param id - 테넌트 역할 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_TENANT_ROLE = gql`
  mutation DeleteTenantRole($id: ID!) {
    deleteTenantRole(id: $id) {
      success
      message
    }
  }
`;
