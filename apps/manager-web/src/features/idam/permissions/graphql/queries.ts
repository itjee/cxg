/**
 * @file queries.ts
 * @description Permissions GraphQL Queries
 *
 * 권한 조회 쿼리 정의
 *
 * 타입 명명 규칙:
 * - 목록 조회 파라미터: PermissionsQueryVariables (복수)
 * - 단일 조회 파라미터: PermissionQueryVariables (단수)
 */

import { gql } from "@apollo/client";
import type { PermissionsQueryVariables } from "../types/permissions.types";

/**
 * 권한 목록 조회 (복수)
 */
export const GET_PERMISSIONS = gql`
  query GetPermissions($limit: Int, $offset: Int, $search: String, $status: String, $category: String, $resource: String, $action: String, $scope: String) {
    permissions(limit: $limit, offset: $offset, search: $search, status: $status, category: $category, resource: $resource, action: $action, scope: $scope) {
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

// ===== 쿼리 변수 타입 (복수형) =====

/**
 * GET_PERMISSIONS 쿼리 변수 (복수)
 */
export interface PermissionsQueryVariablesExport extends PermissionsQueryVariables {}

/**
 * GET_PERMISSION 쿼리 변수 (단수)
 */
export interface PermissionQueryVariables {
  id: string;
}

// 호환성을 위한 별칭
export type GetPermissionsVariables = PermissionsQueryVariablesExport;
export type GetPermissionVariables = PermissionQueryVariables;
