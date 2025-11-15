/**
 * Users GraphQL Mutations
 *
 * Manager Users 생성/수정/삭제 뮤테이션 정의
 */

import { gql } from "@apollo/client";

/**
 * 사용자 생성
 */
export const CREATE_MANAGER_USER = gql`
  mutation CreateManagerUser($input: CreateManagerUserInput!) {
    create_manager_user(input: $input) {
      id
      user_type
      full_name
      email
      phone
      username
      sso_provider
      sso_subject
      mfa_enabled
      status
      last_login_at
      last_login_ip
      failed_login_attempts
      force_password_change
      timezone
      locale
      department
      position
      created_at
      updated_at
    }
  }
`;

/**
 * 사용자 수정
 */
export const UPDATE_MANAGER_USER = gql`
  mutation UpdateManagerUser($id: ID!, $input: UpdateManagerUserInput!) {
    update_manager_user(id: $id, input: $input) {
      id
      user_type
      full_name
      email
      phone
      username
      sso_provider
      sso_subject
      mfa_enabled
      status
      last_login_at
      last_login_ip
      failed_login_attempts
      force_password_change
      timezone
      locale
      department
      position
      created_at
      updated_at
    }
  }
`;

// ===== 뮤테이션 변수 타입 =====

export interface CreateManagerUserVariables {
  input: {
    user_type: string;
    full_name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    department?: string;
    position?: string;
  };
}

export interface UpdateManagerUserVariables {
  id: string;
  input: {
    full_name?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: string;
    mfa_enabled?: boolean;
  };
}
