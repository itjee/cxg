/**
 * @file mutations.ts
 * @description Permissions GraphQL Mutations
 *
 * 권한 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 명명 규칙:
 * - 생성 뮤테이션 변수: CreatePermissionVariables (단수)
 * - 수정 뮤테이션 변수: UpdatePermissionVariables (단수)
 * - 삭제 뮤테이션 변수: DeletePermissionVariables (단수)
 */

import { gql } from "@apollo/client";
import type {
  CreatePermissionInput,
  UpdatePermissionInput,
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

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_PERMISSION 뮤테이션 변수 (단수)
 */
export interface CreatePermissionVariables {
  input: CreatePermissionInput;
}

/**
 * UPDATE_PERMISSION 뮤테이션 변수 (단수)
 */
export interface UpdatePermissionVariables {
  id: string;
  input: UpdatePermissionInput;
}

/**
 * DELETE_PERMISSION 뮤테이션 변수 (단수)
 */
export interface DeletePermissionVariables {
  id: string;
}
