/**
 * @file use-invite-user.ts
 * @description 사용자 초대 및 비밀번호 변경 관련 커스텀 훅
 * 
 * 관리자가 사용자를 초대하고, 사용자가 비밀번호를 변경하는 기능을 제공합니다.
 * 
 * @hooks
 * - useInviteUser: 사용자 초대
 * - useChangePassword: 비밀번호 변경
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/users.service';
import type { UserInviteRequest, PasswordChangeRequest } from '../types';

/**
 * 사용자 초대 mutation hook
 * 
 * @description
 * 관리자가 새로운 사용자를 초대할 때 사용
 * - 임시 비밀번호 자동 생성
 * - 초대 이메일 발송 (프론트엔드에서 처리)
 * - 사용자 목록 자동 재조회
 * 
 * @returns mutation object
 * - mutate: 사용자 초대 실행
 * - data: 초대 결과 (임시 비밀번호 포함)
 * - isLoading: 로딩 상태
 * - isError: 에러 상태
 * - error: 에러 객체
 * 
 * @example
 * ```typescript
 * const inviteUser = useInviteUser({
 *   onSuccess: (data) => {
 *     toast.success(`${data.full_name}님을 초대했습니다`);
 *     // 이메일 발송 처리
 *     sendInvitationEmail(data.email, data.temp_password);
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * 
 * // 사용자 초대
 * inviteUser.mutate({
 *   username: 'johndoe',
 *   email: 'john@company.com',
 *   full_name: '홍길동',
 *   role_id: 'role-uuid'
 * });
 * ```
 */
export function useInviteUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInviteRequest) => userService.inviteUser(data),
    onSuccess: (data) => {
      // 사용자 목록 캐시 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 비밀번호 변경 mutation hook
 * 
 * @description
 * 사용자가 비밀번호를 변경할 때 사용
 * - 현재 비밀번호 검증
 * - 새 비밀번호로 변경
 * - 첫 로그인 시 강제 변경 지원
 * 
 * @returns mutation object
 * - mutate: 비밀번호 변경 실행
 * - data: 변경 결과
 * - isLoading: 로딩 상태
 * - isError: 에러 상태
 * - error: 에러 객체
 * 
 * @example
 * ```typescript
 * const changePassword = useChangePassword({
 *   onSuccess: () => {
 *     toast.success('비밀번호가 변경되었습니다');
 *     router.push('/overview');
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * 
 * // 비밀번호 변경
 * changePassword.mutate({
 *   current_password: 'OldPass123!',
 *   new_password: 'NewPass456!'
 * });
 * ```
 */
export function useChangePassword(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => userService.changePassword(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
