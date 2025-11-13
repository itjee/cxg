/**
 * @file users.service.ts
 * @description 사용자 관리 서비스 레이어
 * 
 * 백엔드 API와 통신하여 사용자 데이터를 관리하는 서비스
 * - RESTful API 호출 (GET, POST, PUT, DELETE)
 * - 에러 처리 및 응답 변환
 * - EnvelopeResponse 구조 처리
 * 
 * @architecture
 * ```
 * Component → Hook (TanStack Query) → Service → Backend API
 *                                        ↑
 *                                     여기 (서비스 레이어)
 * ```
 * 
 * @example
 * ```typescript
 * // 서비스 직접 호출 (일반적으로는 Hook을 통해 사용)
 * const users = await userService.listUsers({ page: 1, pageSize: 10 });
 * const user = await userService.getUser(userId);
 * ```
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserDetailResponse,
  UserQueryParams,
  UserInviteRequest,
  UserInviteResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
} from "../types";

/**
 * 백엔드 API 응답 인터페이스
 * EnvelopeResponse 구조를 표현
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 백엔드 API 엔드포인트
 * FastAPI 백엔드의 Users 라우터와 연결
 */
const ENDPOINT = "/api/v1/tenants/sys/users";

/**
 * 사용자 서비스 객체
 * 
 * @description
 * 백엔드 API와 통신하여 사용자 CRUD 작업을 수행하는 서비스
 * - 모든 메서드는 async/await 사용
 * - 에러 발생 시 ApiError throw
 * - TanStack Query hooks에서 사용
 * 
 * @methods
 * - listUsers: 사용자 목록 조회 (페이징, 필터링)
 * - getUser: 사용자 상세 조회
 * - createUser: 사용자 생성
 * - updateUser: 사용자 수정
 * - deleteUser: 사용자 삭제
 * - toggleUserActive: 사용자 활성/비활성 토글
 * 
 * @example
 * ```typescript
 * // Hook을 통한 사용 (권장)
 * const { data } = useUsers({ page: 1, pageSize: 10 });
 * 
 * // 직접 호출 (특수한 경우)
 * const users = await userService.listUsers({ page: 1 });
 * ```
 */
export const userService = {
  /**
   * 사용자 목록 조회
   * 
   * @description
   * 서버 사이드 페이징 및 필터링을 지원하는 사용자 목록 조회
   * - 페이지네이션: page, page_size
   * - 검색: search (username, email, name 통합 검색)
   * - 필터: active (활성 여부), role_id (역할)
   * 
   * @param params - 쿼리 파라미터 (페이징, 필터링)
   * @param signal - AbortSignal (요청 취소용)
   * @returns UserListResponse - 사용자 목록 및 메타데이터
   * 
   * @throws {ApiError} 네트워크 오류, 서버 오류 등
   * 
   * @example
   * ```typescript
   * // 기본 조회
   * const result = await userService.listUsers();
   * 
   * // 페이징 + 필터링
   * const result = await userService.listUsers({
   *   page: 2,
   *   pageSize: 20,
   *   search: '홍길동',
   *   active: true,
   *   roleId: 'role-001'
   * });
   * 
   * console.log(result.items);      // User[]
   * console.log(result.total);      // 전체 개수
   * console.log(result.total_pages); // 전체 페이지 수
   * ```
   */
  async listUsers(
    params?: UserQueryParams,
    signal?: AbortSignal
  ): Promise<UserListResponse> {
    try {
      const response = await api.get<ApiResponse<UserListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          active: params?.active,
          role_id: params?.roleId,
        },
        signal,
      });
      
      // EnvelopeResponse 구조: { data: UserListResponse }
      return response.data.data || { 
        items: [], 
        total: 0, 
        page: 1, 
        page_size: 10,
        total_pages: 0
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listUsers");
    }
  },

  /**
   * 사용자 상세 조회
   * 
   * @description
   * 특정 사용자의 상세 정보를 조회
   * - 수정 폼에 데이터를 채울 때 사용
   * - 존재하지 않는 ID는 404 에러 발생
   * 
   * @param id - 사용자 ID (UUID)
   * @param signal - AbortSignal (요청 취소용)
   * @returns User - 사용자 상세 정보
   * 
   * @throws {ApiError} NOT_FOUND, NETWORK_ERROR 등
   * 
   * @example
   * ```typescript
   * const user = await userService.getUser('user-uuid');
   * console.log(user.username);
   * console.log(user.email);
   * ```
   */
  async getUser(id: string, signal?: AbortSignal): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      // EnvelopeResponse 구조: { data: User }
      if (!response.data.data) {
        throw new Error('User not found');
      }
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getUser(${id})`);
    }
  },

  /**
   * 사용자 생성
   * 
   * @description
   * 새로운 사용자 계정을 생성
   * - user_code, username, email은 필수
   * - password_hash는 백엔드에서 해싱 처리
   * - 중복된 username/email은 409 Conflict 에러 발생
   * 
   * @param data - 생성할 사용자 정보
   * @param signal - AbortSignal (요청 취소용)
   * @returns User - 생성된 사용자 정보
   * 
   * @throws {ApiError} ALREADY_EXISTS, VALIDATION_ERROR 등
   * 
   * @example
   * ```typescript
   * const newUser = await userService.createUser({
   *   user_code: 'U001',
   *   username: 'johndoe',
   *   email: 'john@example.com',
   *   password_hash: 'hashed_password',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   is_active: true
   * });
   * ```
   */
  async createUser(
    data: CreateUserRequest,
    signal?: AbortSignal
  ): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as User);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createUser");
    }
  },

  /**
   * 사용자 수정
   * 
   * @description
   * 기존 사용자 정보를 수정 (부분 업데이트 지원)
   * - 모든 필드가 optional
   * - 제공된 필드만 업데이트됨
   * - HTTP PUT 메서드 사용
   * 
   * @param id - 사용자 ID (UUID)
   * @param data - 수정할 필드 (부분 업데이트)
   * @param signal - AbortSignal (요청 취소용)
   * @returns User - 수정된 사용자 정보
   * 
   * @throws {ApiError} NOT_FOUND, VALIDATION_ERROR 등
   * 
   * @example
   * ```typescript
   * // 이메일만 변경
   * const updated = await userService.updateUser('user-id', {
   *   email: 'newemail@example.com'
   * });
   * 
   * // 여러 필드 변경
   * const updated = await userService.updateUser('user-id', {
   *   first_name: 'Jane',
   *   phone: '010-9999-8888',
   *   is_active: false
   * });
   * ```
   */
  async updateUser(
    id: string,
    data: UpdateUserRequest,
    signal?: AbortSignal
  ): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as User);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateUser(${id})`);
    }
  },

  /**
   * 사용자 삭제
   * 
   * @description
   * 사용자 계정을 삭제 (논리적 삭제 or 물리적 삭제)
   * - 백엔드에서 is_deleted 플래그 설정 or 실제 삭제
   * - 복구 불가능할 수 있으므로 신중하게 사용
   * 
   * @param id - 사용자 ID (UUID)
   * @param signal - AbortSignal (요청 취소용)
   * @returns void
   * 
   * @throws {ApiError} NOT_FOUND, FORBIDDEN 등
   * 
   * @example
   * ```typescript
   * await userService.deleteUser('user-id');
   * // 삭제 완료 (반환값 없음)
   * ```
   */
  async deleteUser(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteUser(${id})`);
    }
  },

  /**
   * 사용자 활성화/비활성화
   */
  async toggleUserActive(
    id: string,
    active: boolean,
    signal?: AbortSignal
  ): Promise<User> {
    try {
      const response = await api.patch<ApiResponse<User>>(
        `${ENDPOINT}/${id}`,
        { active },
        { signal }
      );
      return response.data.data || ({} as User);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `toggleUserActive(${id})`);
    }
  },

  /**
   * 사용자 초대
   * 
   * @description
   * 관리자가 새로운 사용자를 초대합니다.
   * - 시스템이 임시 비밀번호를 자동 생성
   * - 초대 이메일 발송 (프론트엔드에서 처리)
   * - 초대된 사용자는 첫 로그인 시 비밀번호 변경 필요
   * 
   * @param data - 초대할 사용자 정보
   * @param signal - AbortSignal (요청 취소용)
   * @returns UserInviteResponse - 초대 결과 (임시 비밀번호 포함)
   * 
   * @throws {ApiError} ALREADY_EXISTS, VALIDATION_ERROR 등
   * 
   * @example
   * ```typescript
   * const result = await userService.inviteUser({
   *   username: 'johndoe',
   *   email: 'john@company.com',
   *   full_name: '홍길동',
   *   role_id: 'role-uuid',
   *   position: '사원'
   * });
   * 
   * console.log(result.temp_password); // 임시 비밀번호 (이메일 발송용)
   * ```
   */
  async inviteUser(
    data: UserInviteRequest,
    signal?: AbortSignal
  ): Promise<UserInviteResponse> {
    try {
      const response = await api.post<ApiResponse<UserInviteResponse>>(
        `${ENDPOINT}/invite`,
        data,
        { signal }
      );
      if (!response.data.data) {
        throw new Error('Failed to invite user');
      }
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "inviteUser");
    }
  },

  /**
   * 비밀번호 변경
   * 
   * @description
   * 사용자가 비밀번호를 변경합니다.
   * - 현재 비밀번호 검증 필수
   * - 첫 로그인 시 강제 변경 가능
   * 
   * @param data - 현재 비밀번호 및 새 비밀번호
   * @param signal - AbortSignal (요청 취소용)
   * @returns PasswordChangeResponse - 변경 결과
   * 
   * @throws {ApiError} INVALID_PASSWORD, VALIDATION_ERROR 등
   * 
   * @example
   * ```typescript
   * const result = await userService.changePassword({
   *   current_password: 'OldPass123!',
   *   new_password: 'NewPass456!'
   * });
   * 
   * console.log(result.message); // "비밀번호가 성공적으로 변경되었습니다."
   * ```
   */
  async changePassword(
    data: PasswordChangeRequest,
    signal?: AbortSignal
  ): Promise<PasswordChangeResponse> {
    try {
      const response = await api.post<ApiResponse<PasswordChangeResponse>>(
        `${ENDPOINT}/change-password`,
        data,
        { signal }
      );
      if (!response.data.data) {
        throw new Error('Failed to change password');
      }
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "changePassword");
    }
  },
};
