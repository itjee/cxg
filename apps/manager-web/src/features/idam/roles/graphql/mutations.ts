/**
 * @file mutations.ts
 * @description Roles GraphQL Mutations
 *
 * Roles 생성/수정/삭제 뮤테이션 정의
 *
 * 타입 정의는 ../types/roles.types.ts에서 관리됨
 */

import { gql } from "@apollo/client";
import type { CreateRoleInput, UpdateRoleInput, CreateRoleVariables, UpdateRoleVariables, DeleteRoleVariables } from "../types/roles.types";

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
