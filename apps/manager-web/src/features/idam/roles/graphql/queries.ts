/**
 * @file queries.ts
 * @description Roles GraphQL Queries
 *
 * Roles (역할) 조회 쿼리 정의
 *
 * 타입 정의는 ../types/roles.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { RolesQueryVariables, RoleQueryVariables } from "../types/roles.types";

/**
 * 역할 목록 조회 (복수)
 */
export const GET_ROLES = gql`
  query GetRoles($limit: Int, $offset: Int, $status: String, $category: String, $search: String) {
    roles(limit: $limit, offset: $offset, status: $status, category: $category, search: $search) {
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
