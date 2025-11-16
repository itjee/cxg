/**
 * @file mutations.ts
 * @description Roles GraphQL Mutations
 *
 * Roles 생성/수정/삭제 뮤테이션 정의
 */

import { gql } from "@apollo/client";
import type { CreateRoleInput, UpdateRoleInput } from "../types/roles.types";

/**
 * 역할 생성 (단수)
 */
export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
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
 * 역할 수정 (단수)
 */
export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
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
 * 역할 삭제 (단수)
 */
export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      message
    }
  }
`;

// ===== 뮤테이션 변수 타입 (단수형) =====

/**
 * CREATE_ROLE 뮤테이션 변수 (단수)
 */
export interface CreateRoleVariables {
  input: CreateRoleInput;
}

/**
 * UPDATE_ROLE 뮤테이션 변수 (단수)
 */
export interface UpdateRoleVariables {
  id: string;
  input: UpdateRoleInput;
}

/**
 * DELETE_ROLE 뮤테이션 변수 (단수)
 */
export interface DeleteRoleVariables {
  id: string;
}
