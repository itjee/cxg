/**
 * @file users.queries.ts
 * @description 사용자 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Strawberry GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 사용자 목록 조회 쿼리
 *
 * @query users
 * @param limit - 조회할 사용자 수
 * @param offset - 시작 위치 (페이지네이션)
 * @returns 사용자 목록 배열
 *
 * @example
 * ```graphql
 * query GetUsers($limit: Int!, $offset: Int!) {
 *   users(limit: $limit, offset: $offset) {
 *     id
 *     username
 *     email
 *     ...
 *   }
 * }
 * ```
 */
export const GET_USERS = gql`
  query GetUsers($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset) {
      id
      user_code
      username
      email
      first_name
      last_name
      phone
      department_id
      position
      role_id
      failed_login_attempts
      locked_until
      last_login_at
      last_login_ip
      is_system_user
      is_active
      is_deleted
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 사용자 상세 조회 쿼리
 *
 * @query user
 * @param id - 사용자 ID (UUID)
 * @returns 사용자 상세 정보
 *
 * @example
 * ```graphql
 * query GetUser($id: ID!) {
 *   user(id: $id) {
 *     id
 *     username
 *     email
 *     ...
 *   }
 * }
 * ```
 */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      user_code
      username
      email
      first_name
      last_name
      phone
      department_id
      position
      role_id
      failed_login_attempts
      locked_until
      last_login_at
      last_login_ip
      is_system_user
      is_active
      is_deleted
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 사용자 생성 뮤테이션
 *
 * @mutation createUser
 * @param input - 사용자 생성 입력 데이터
 * @returns 생성된 사용자 정보
 *
 * @example
 * ```graphql
 * mutation CreateUser($input: TenantsUserCreateInput!) {
 *   createUser(input: $input) {
 *     id
 *     username
 *     email
 *     ...
 *   }
 * }
 * ```
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: TenantsUserCreateInput!) {
    createUser(input: $input) {
      id
      user_code
      username
      email
      first_name
      last_name
      phone
      department_id
      position
      role_id
      failed_login_attempts
      locked_until
      last_login_at
      last_login_ip
      is_system_user
      is_active
      is_deleted
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;

/**
 * 사용자 수정 뮤테이션
 *
 * @mutation updateUser
 * @param id - 사용자 ID (UUID)
 * @param input - 사용자 수정 입력 데이터
 * @returns 수정된 사용자 정보
 *
 * @example
 * ```graphql
 * mutation UpdateUser($id: ID!, $input: TenantsUserUpdateInput!) {
 *   updateUser(id: $id, input: $input) {
 *     id
 *     username
 *     email
 *     ...
 *   }
 * }
 * ```
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: TenantsUserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      user_code
      username
      email
      first_name
      last_name
      phone
      department_id
      position
      role_id
      failed_login_attempts
      locked_until
      last_login_at
      last_login_ip
      is_system_user
      is_active
      is_deleted
      created_at
      updated_at
      created_by
      updated_by
    }
  }
`;
