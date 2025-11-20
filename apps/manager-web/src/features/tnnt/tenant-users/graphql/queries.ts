/**
 * @file queries.ts
 * @description 테넌트 사용자 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 테넌트 사용자 목록 조회 쿼리
 *
 * @query tenantUsers
 * @param limit - 조회할 사용자 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param tenant_id - 테넌트 ID (선택)
 * @param role_id - 역할 ID (선택)
 * @param status - 상태 필터 (선택)
 * @param is_primary - 주 사용자 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 테넌트 사용자 목록 배열
 */
export const GET_TENANT_USERS = gql`
  query GetTenantUsers(
    $limit: Int!
    $offset: Int!
    $tenant_id: String
    $role_id: String
    $status: String
    $is_primary: Boolean
    $search: String
  ) {
    tenantUsers(
      limit: $limit
      offset: $offset
      tenant_id: $tenant_id
      role_id: $role_id
      status: $status
      is_primary: $is_primary
      search: $search
    ) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      user_id
      username
      email
      full_name
      phone_number
      role_id
      role_name
      permissions
      last_login_at
      login_count
      failed_login_count
      status
      is_primary
      is_deleted
    }
  }
`;

/**
 * 테넌트 사용자 상세 조회 쿼리
 *
 * @query tenantUser
 * @param id - 테넌트 사용자 ID (UUID)
 * @returns 테넌트 사용자 상세 정보
 */
export const GET_TENANT_USER = gql`
  query GetTenantUser($id: ID!) {
    tenantUser(id: $id) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      user_id
      username
      email
      full_name
      phone_number
      role_id
      role_name
      permissions
      last_login_at
      login_count
      failed_login_count
      status
      is_primary
      is_deleted
    }
  }
`;

/**
 * 테넌트 사용자 생성 뮤테이션
 *
 * @mutation createTenantUser
 * @param input - 테넌트 사용자 생성 입력 데이터
 * @returns 생성된 테넌트 사용자 정보
 */
export const CREATE_TENANT_USER = gql`
  mutation CreateTenantUser($input: ManagerTenantUserCreateInput!) {
    createTenantUser(input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      user_id
      username
      email
      full_name
      phone_number
      role_id
      role_name
      permissions
      last_login_at
      login_count
      failed_login_count
      status
      is_primary
      is_deleted
    }
  }
`;

/**
 * 테넌트 사용자 수정 뮤테이션
 *
 * @mutation updateTenantUser
 * @param id - 테넌트 사용자 ID (UUID)
 * @param input - 테넌트 사용자 수정 입력 데이터
 * @returns 수정된 테넌트 사용자 정보
 */
export const UPDATE_TENANT_USER = gql`
  mutation UpdateTenantUser($id: ID!, $input: ManagerTenantUserUpdateInput!) {
    updateTenantUser(id: $id, input: $input) {
      id
      created_at
      created_by
      updated_at
      updated_by
      tenant_id
      user_id
      username
      email
      full_name
      phone_number
      role_id
      role_name
      permissions
      last_login_at
      login_count
      failed_login_count
      status
      is_primary
      is_deleted
    }
  }
`;

/**
 * 테넌트 사용자 삭제 뮤테이션
 *
 * @mutation deleteTenantUser
 * @param id - 테넌트 사용자 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_TENANT_USER = gql`
  mutation DeleteTenantUser($id: ID!) {
    deleteTenantUser(id: $id) {
      success
      message
    }
  }
`;

/**
 * 비밀번호 변경 뮤테이션
 *
 * @mutation changeTenantUserPassword
 * @param id - 테넌트 사용자 ID (UUID)
 * @param input - 비밀번호 변경 입력 데이터
 * @returns 변경 결과
 */
export const CHANGE_TENANT_USER_PASSWORD = gql`
  mutation ChangeTenantUserPassword($id: ID!, $input: ChangePasswordInput!) {
    changeTenantUserPassword(id: $id, input: $input) {
      success
      message
    }
  }
`;

/**
 * 비밀번호 재설정 뮤테이션
 *
 * @mutation resetTenantUserPassword
 * @param id - 테넌트 사용자 ID (UUID)
 * @returns 임시 비밀번호
 */
export const RESET_TENANT_USER_PASSWORD = gql`
  mutation ResetTenantUserPassword($id: ID!) {
    resetTenantUserPassword(id: $id) {
      success
      message
      temporary_password
    }
  }
`;
