/**
 * 인증 API 서비스 (GraphQL 기반)
 * Feature-driven 아키텍처에 따른 API 통신 계층
 *
 * GraphQL Apollo Client를 사용하여 인증 관련 요청을 처리합니다.
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  SIGNIN,
  SIGNUP,
  REFRESH_TOKEN,
  LOGOUT,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_CURRENT_USER,
  type SigninVariables,
  type SignupVariables,
  type ChangePasswordVariables,
  type ForgotPasswordVariables,
  type ResetPasswordVariables,
  type GetCurrentUserResponse,
} from "../graphql";
import type {
  SigninRequest,
  SignupRequest,
  TokenResponse,
  User,
} from "../types/auth.types";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/reset-password.types";

export const authService = {
  /**
   * 회원가입 (signup)
   */
  async signup(data: SignupRequest): Promise<User> {
    try {
      const result = await apolloClient.mutate<
        { signup: any },
        SignupVariables
      >({
        mutation: SIGNUP,
        variables: {
          input: {
            username: data.username,
            email: data.email,
            password: data.password,
            fullName: data.fullName,
          },
        },
      });

      if (!result.data?.signup) {
        throw new Error("회원가입에 실패했습니다.");
      }

      return result.data.signup;
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "회원가입에 실패했습니다.";

      const err: any = new Error(errorMessage);
      err.code = error?.graphQLErrors?.[0]?.extensions?.code;
      throw err;
    }
  },

  /**
   * 로그인 (signin)
   * GraphQL 뮤테이션으로 사용자 인증 및 토큰 발급
   */
  async signin(data: SigninRequest): Promise<TokenResponse> {
    try {
      const result = await apolloClient.mutate<
        { signin: any },
        SigninVariables
      >({
        mutation: SIGNIN,
        variables: {
          input: {
            username: data.username,
            password: data.password,
          },
        },
      });

      if (!result.data?.signin) {
        throw new Error("로그인에 실패했습니다.");
      }

      return result.data.signin;
    } catch (error: any) {
      const graphQLError = error?.graphQLErrors?.[0];
      const errorMessage =
        graphQLError?.message || error?.message || "로그인에 실패했습니다.";

      const err: any = new Error(errorMessage);
      err.code = graphQLError?.extensions?.code;
      err.detail = graphQLError?.extensions?.detail;
      throw err;
    }
  },

  /**
   * 토큰 갱신
   * Refresh Token으로 새로운 Access Token 발급
   *
   * @param refreshToken - Refresh Token 값
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const result = await apolloClient.mutate<
        { refreshToken: any },
        { input: { refreshToken: string } }
      >({
        mutation: REFRESH_TOKEN,
        variables: {
          input: {
            refreshToken,
          },
        },
      });

      if (!result.data?.refreshToken) {
        throw new Error("토큰 갱신에 실패했습니다.");
      }

      return result.data.refreshToken;
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "토큰 갱신에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },

  /**
   * 현재 사용자 정보 조회
   * 로그인한 사용자의 프로필 정보를 GraphQL 쿼리로 조회
   */
  async getCurrentUser(): Promise<User> {
    try {
      const result = await apolloClient.query<GetCurrentUserResponse>({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });

      if (!result.data?.me) {
        throw new Error("사용자 정보 조회에 실패했습니다.");
      }

      return result.data.me;
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "사용자 정보 조회에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },

  /**
   * 로그아웃
   * 클라이언트에서 토큰을 삭제하고 서버 상태 업데이트
   */
  async logout(): Promise<void> {
    try {
      await apolloClient.mutate({
        mutation: LOGOUT,
      });
    } catch (error: any) {
      // 로그아웃 오류는 클라이언트 상태 정리를 방해하지 않음
      console.warn("로그아웃 오류:", error);
    }
  },

  /**
   * 비밀번호 변경
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const result = await apolloClient.mutate<
        { changePassword: any },
        ChangePasswordVariables
      >({
        mutation: CHANGE_PASSWORD,
        variables: {
          input: {
            currentPassword,
            newPassword,
          },
        },
      });

      if (!result.data?.changePassword) {
        throw new Error("비밀번호 변경에 실패했습니다.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "비밀번호 변경에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },

  /**
   * 비밀번호 찾기 (이메일로 재설정 링크 발송)
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      const result = await apolloClient.mutate<
        { forgotPassword: any },
        ForgotPasswordVariables
      >({
        mutation: FORGOT_PASSWORD,
        variables: {
          input: {
            email: data.email,
          },
        },
      });

      if (!result.data?.forgotPassword) {
        throw new Error("비밀번호 재설정 요청에 실패했습니다.");
      }

      return {
        message: result.data.forgotPassword.message,
        reset_token: result.data.forgotPassword.resetToken,
      };
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "비밀번호 재설정 요청에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },

  /**
   * 비밀번호 재설정
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      const result = await apolloClient.mutate<
        { resetPassword: any },
        ResetPasswordVariables
      >({
        mutation: RESET_PASSWORD,
        variables: {
          input: {
            token: data.token,
            newPassword: data.new_password,
            username: data.username,
          },
        },
      });

      if (!result.data?.resetPassword) {
        throw new Error("비밀번호 재설정에 실패했습니다.");
      }

      return {
        message: result.data.resetPassword.message,
      };
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "비밀번호 재설정에 실패했습니다.";

      throw new Error(errorMessage);
    }
  },
};
