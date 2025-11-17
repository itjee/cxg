/**
 * @file queries.ts
 * @description Permissions GraphQL Queries
 *
 * 권한 조회 쿼리 정의
 *
 * 타입 정의는 ../types/permissions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  PermissionsQueryVariables,
  PermissionQueryVariables,
} from "../types/permissions.types";

/**
 * 권한 목록 조회 (복수)
 */
export const GET_PERMISSIONS = gql`
  query GetPermissions(
    $limit: Int
    $offset: Int
    $search: String
    $status: String
    $category: String
    $resource: String
    $action: String
    $scope: String
  ) {
    permissions(
      limit: $limit
      offset: $offset
      search: $search
      status: $status
      category: $category
      resource: $resource
      action: $action
      scope: $scope
    ) {
      id
      code
      name
      description
      category
      resource
      action
      scope
      appliesToAppliesTo
      isSystem
      status
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * 권한 상세 조회 (단수)
 */
export const GET_PERMISSION = gql`
  query GetPermission($id: ID!) {
    permission(id: $id) {
      id
      code
      name
      description
      category
      resource
      action
      scope
      appliesToAppliesTo
      isSystem
      status
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;
