/**
 * @file permissions.graphql.ts
 * @description Manager IDAM Permissions GraphQL queries (Apollo Client)
 */

import { gql } from '@apollo/client';

/**
 * 권한 목록 조회 쿼리
 */
export const GET_MANAGER_PERMISSIONS = gql`
  query GetManagerPermissions($limit: Int, $offset: Int, $category: String, $resource: String) {
    managerPermissions(limit: $limit, offset: $offset, category: $category, resource: $resource) {
      id
      code
      name
      action
      resource
      category
      description
      scope
      isSystem
      createdAt
      updatedAt
    }
  }
`;

/**
 * 권한 단건 조회 쿼리
 */
export const GET_MANAGER_PERMISSION = gql`
  query GetManagerPermission($id: ID!) {
    managerPermission(id: $id) {
      id
      code
      name
      action
      resource
      category
      description
      scope
      isSystem
      createdAt
      updatedAt
    }
  }
`;

/**
 * GraphQL 변수 타입 정의
 */
export interface GetManagerPermissionsVariables {
  limit?: number;
  offset?: number;
  category?: string;
  resource?: string;
}

export interface GetManagerPermissionVariables {
  id: string;
}
