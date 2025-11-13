/**
 * @file roles.graphql.ts
 * @description Manager IDAM Roles GraphQL queries and mutations (Apollo Client)
 */

import { gql } from '@apollo/client';

/**
 * 역할 목록 조회 쿼리
 */
export const GET_MANAGER_ROLES = gql`
  query GetManagerRoles($limit: Int, $offset: Int, $category: String, $status: String) {
    managerRoles(limit: $limit, offset: $offset, category: $category, status: $status) {
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
 * 역할 단건 조회 쿼리
 */
export const GET_MANAGER_ROLE = gql`
  query GetManagerRole($id: ID!) {
    managerRole(id: $id) {
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
      permissions {
        id
        code
        name
        action
        resource
        category
        description
      }
    }
  }
`;

/**
 * 역할 생성 뮤테이션
 */
export const CREATE_MANAGER_ROLE = gql`
  mutation CreateManagerRole($input: ManagerRoleCreateInput!) {
    createManagerRole(input: $input) {
      id
      code
      name
      description
      category
      level
      scope
      status
      createdAt
    }
  }
`;

/**
 * 역할 수정 뮤테이션
 */
export const UPDATE_MANAGER_ROLE = gql`
  mutation UpdateManagerRole($id: ID!, $input: ManagerRoleUpdateInput!) {
    updateManagerRole(id: $id, input: $input) {
      id
      name
      description
      level
      priority
      status
      updatedAt
    }
  }
`;

/**
 * GraphQL 변수 타입 정의
 */
export interface GetManagerRolesVariables {
  limit?: number;
  offset?: number;
  category?: string;
  status?: string;
}

export interface GetManagerRoleVariables {
  id: string;
}

export interface CreateManagerRoleVariables {
  input: {
    code: string;
    name: string;
    description?: string;
    category: string;
    level: number;
    scope: string;
    isDefault?: boolean;
    priority?: number;
  };
}

export interface UpdateManagerRoleVariables {
  id: string;
  input: {
    name?: string;
    description?: string;
    level?: number;
    isDefault?: boolean;
    priority?: number;
    status?: string;
  };
}
