/**
 * Roles GraphQL Queries
 *
 * Roles (역할) 조회 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 역할 목록 조회
 */
export const GET_ROLES = gql`
  query GetRoles($limit: Int, $offset: Int, $status: String) {
    roles(limit: $limit, offset: $offset, status: $status) {
      id
      name
      description
      status
      permissions
      createdAt
      updatedAt
    }
  }
`;

/**
 * 역할 상세 조회
 */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      name
      description
      status
      permissions
      createdAt
      updatedAt
    }
  }
`;

// ===== 쿼리 변수 타입 =====

export interface GetRolesVariables {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface GetRoleVariables {
  id: string;
}
