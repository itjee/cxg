/**
 * @file queries.ts
 * @description Roles GraphQL Queries
 *
 * Roles (역할) 조회 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 역할 목록 조회 (복수)
 */
export const GET_ROLES = gql`
  query GetRoles($limit: Int, $offset: Int, $status: String) {
    roles(limit: $limit, offset: $offset, status: $status) {
      id
      code
      name
      description
      category
      level
      scope
      isDefault
      priority
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * 역할 상세 조회 (단수)
 */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      code
      name
      description
      category
      level
      scope
      isDefault
      priority
      status
      createdAt
      updatedAt
    }
  }
`;

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_ROLES 쿼리 변수 (복수)
 */
export interface RolesQueryVariables {
  limit?: number;
  offset?: number;
  status?: string;
}

/**
 * GET_ROLE 쿼리 변수 (단수)
 */
export interface RoleQueryVariables {
  id: string;
}
