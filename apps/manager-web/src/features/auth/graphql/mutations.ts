/**
 * Auth GraphQL Mutations
 *
 * 인증 관련 GraphQL 뮤테이션 정의
 * - signin: 로그인
 * - signup: 회원가입
 * - refresh_token: 토큰 갱신
 * - logout: 로그아웃
 * - change_password: 비밀번호 변경
 * - forgot_password: 비밀번호 찾기
 * - reset_password: 비밀번호 재설정
 */

import { gql } from "@apollo/client";

/**
 * 로그인 뮤테이션
 *
 * 사용자명과 비밀번호로 로그인하여 Access Token과 Refresh Token을 발급받습니다.
 */
export const SIGNIN = gql`
  mutation Signin($input: SigninInput!) {
    signin(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
`;

/**
 * 회원가입 뮤테이션
 *
 * 새로운 사용자를 등록합니다.
 */
export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      id
      username
      email
      fullName
      userType
      status
      createdAt
    }
  }
`;

/**
 * 토큰 갱신 뮤테이션
 *
 * Refresh Token으로 새로운 Access Token을 발급받습니다.
 * 이 뮤테이션은 인증이 필요합니다.
 */
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
`;

/**
 * 로그아웃 뮤테이션
 *
 * 로그아웃 처리 (실제로는 클라이언트에서 토큰 삭제)
 */
export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

/**
 * 비밀번호 변경 뮤테이션
 *
 * 현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.
 * 인증이 필요합니다.
 */
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      message
    }
  }
`;

/**
 * 비밀번호 찾기 뮤테이션
 *
 * 이메일로 비밀번호 재설정 링크를 발송합니다.
 */
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ResetPasswordInput!) {
    forgotPassword(input: $input) {
      message
      resetToken
    }
  }
`;

/**
 * 비밀번호 재설정 뮤테이션
 *
 * 토큰과 새 비밀번호로 비밀번호를 재설정합니다.
 */
export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordConfirmInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

// ===== Type definitions for mutations =====

export interface SigninVariables {
  input: {
    username: string;
    password: string;
  };
}

export interface SignupVariables {
  input: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  };
}

export interface RefreshTokenVariables {
  input: {
    refreshToken: string;
  };
}

export interface ChangePasswordVariables {
  input: {
    currentPassword: string;
    newPassword: string;
  };
}

export interface ForgotPasswordVariables {
  input: {
    email: string;
  };
}

export interface ResetPasswordVariables {
  input: {
    token?: string;
    newPassword: string;
    username?: string;
  };
}
