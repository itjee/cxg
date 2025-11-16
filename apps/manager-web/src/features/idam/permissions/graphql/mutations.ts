/**
 * @file mutations.ts
 * @description Permissions GraphQL Mutations
 *
 * 권한 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 정의는 ../types/permissions.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type {
  CreatePermissionInput,
  UpdatePermissionInput,
  CreatePermissionVariables,
  UpdatePermissionVariables,
  DeletePermissionVariables,
} from "../types/permissions.types";

/**
 * 권한 생성 (단수)
 */
export const CREATE_PERMISSION = gql`
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
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
 * 권한 수정 (단수)
 */
export const UPDATE_PERMISSION = gql`
  mutation UpdatePermission($id: ID!, $input: UpdatePermissionInput!) {
    updatePermission(id: $id, input: $input) {
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
 * 권한 삭제 (단수)
 */
export const DELETE_PERMISSION = gql`
  mutation DeletePermission($id: ID!) {
    deletePermission(id: $id) {
      message
    }
  }
`;
