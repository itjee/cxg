/**
 * Roles GraphQL Mutations
 *
 * Roles 생성/수정/삭제 뮤테이션 정의
 */

import { gql } from "@apollo/client";

/**
 * 역할 생성
 */
export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
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
 * 역할 수정
 */
export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
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
 * 역할 삭제
 */
export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      message
    }
  }
`;

// ===== 뮤테이션 변수 타입 =====

export interface CreateRoleVariables {
  input: {
    name: string;
    description?: string;
    status: string;
    permissions?: string[];
  };
}

export interface UpdateRoleVariables {
  id: string;
  input: {
    name?: string;
    description?: string;
    status?: string;
    permissions?: string[];
  };
}

export interface DeleteRoleVariables {
  id: string;
}
