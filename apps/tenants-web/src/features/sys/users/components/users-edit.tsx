'use client';

/**
 * @file users-edit.tsx
 * @description 사용자 생성/수정 Drawer 컨테이너 컴포넌트
 * 
 * 사용자 생성 및 수정 Drawer를 관리하는 Container Component
 * - Drawer 상태 관리 (열기/닫기)
 * - 데이터 로딩 (수정 모드)
 * - 폼 제출 처리 (생성/수정 mutation)
 * - UsersForm (Presentational) 컴포넌트 래핑
 * 
 * @component
 * - Container Component (비즈니스 로직 포함)
 * - 상태: useUserStore (Drawer 상태)
 * - 데이터: useUser, useCreateUser, useUpdateUser (React Query)
 * 
 * @pattern Container/Presentational
 * ```
 * UsersEdit (Container)
 *   ├─ Drawer 상태 관리
 *   ├─ 데이터 로딩
 *   ├─ Mutation 처리
 *   └─ UsersForm (Presentational)
 *       └─ UI 렌더링
 * ```
 * 
 * @example
 * ```tsx
 * <UsersEdit users={users} />
 * ```
 */

import { useMemo } from 'react';
import { toast } from 'sonner';
import { EntityDrawer } from '@/components/features';
import { UsersForm } from './users-form';
import { useUserStore } from '../stores';
import { useUser, useCreateUser, useUpdateUser } from '../hooks';
import type { CreateUserRequest, UpdateUserRequest, User } from '../types';

/**
 * UsersEdit Props 인터페이스
 * 
 * @interface UsersEditProps
 * @property {User[]} users - 역할 목록 추출용 사용자 배열
 */
interface UsersEditProps {
  /**
   * 전체 사용자 목록
   * 
   * @description
   * 역할 목록을 동적으로 추출하기 위해 사용
   * - 사용자들의 role_id와 role_name을 중복 제거하여 역할 목록 생성
   * - 폼의 역할 선택 드롭다운에 사용됨
   * 
   * @note
   * 향후 개선: 별도의 roles API 엔드포인트로 분리 권장
   */
  users: User[];
}

/**
 * 사용자 생성/수정 Drawer 컴포넌트
 * 
 * @description
 * EntityDrawer를 사용하여 사용자 폼을 표시하고 제출을 처리하는 컨테이너
 * - 생성 모드: editingId === null
 * - 수정 모드: editingId !== null
 * 
 * @features
 * 1. Drawer 상태 관리
 *    - formOpen: Drawer 열림/닫힘 상태
 *    - editingId: 수정할 사용자 ID (null이면 생성 모드)
 *    - closeForm(): Drawer 닫기 + 상태 초기화
 * 
 * 2. 데이터 로딩 (수정 모드)
 *    - useUser(editingId): 사용자 상세 조회
 *    - 로딩 중: 폼에 로딩 스피너 표시
 *    - 에러: 토스트 알림 표시
 * 
 * 3. 생성 Mutation
 *    - useCreateUser(): 사용자 생성
 *    - 성공: 토스트 알림 + Drawer 닫기 + 목록 갱신
 *    - 실패: 에러 토스트 + 콘솔 로그
 * 
 * 4. 수정 Mutation
 *    - useUpdateUser(): 사용자 수정
 *    - 성공: 토스트 알림 + Drawer 닫기 + 목록 갱신
 *    - 실패: 에러 토스트 + 콘솔 로그
 * 
 * @state (Zustand)
 * - formOpen: boolean (Drawer 열림 상태)
 * - editingId: string | null (수정 모드 식별)
 * - closeForm: () => void (Drawer 닫기)
 * 
 * @queries (React Query)
 * - useUser(editingId): 사용자 상세 조회
 * - useCreateUser(): 생성 mutation
 * - useUpdateUser(): 수정 mutation
 * 
 * @example
 * ```tsx
 * // 부모 컴포넌트에서 사용
 * <UsersEdit users={users} />
 * 
 * // 생성 Drawer 열기
 * openForm(); // editingId = null
 * 
 * // 수정 Drawer 열기
 * openForm('user-id'); // editingId = 'user-id'
 * ```
 * 
 * @param props - UsersEditProps
 * @returns JSX.Element - EntityDrawer + UsersForm
 */
export function UsersEdit({ users }: UsersEditProps) {
  // ============================================================
  // 1. Zustand 상태 관리
  // ============================================================
  
  /**
   * Drawer 상태 및 액션
   * - formOpen: Drawer 열림/닫힘 상태
   * - editingId: 수정할 사용자 ID (null이면 생성 모드)
   * - closeForm: Drawer 닫기 함수
   */
  const { formOpen, editingId, closeForm } = useUserStore();
  
  // ============================================================
  // 2. 데이터 조회 (수정 모드)
  // ============================================================
  
  /**
   * 수정할 사용자 데이터 조회
   *
   * @description
   * - editingId가 null이면 쿼리 비활성화 (enabled: false)
   * - editingId가 있으면 해당 사용자 상세 조회
   * - 조회된 데이터는 폼의 initialData로 전달됨
   */
  const { data: editingUser, isLoading: isUserLoading } = useUser(editingId);

  // ============================================================
  // 3. Mutation 설정 (생성/수정)
  // ============================================================
  
  /**
   * 사용자 생성 Mutation
   * 
   * @description
   * - onSuccess: 성공 토스트 + Drawer 닫기
   * - onError: 에러 토스트 + 콘솔 로그
   * - Optimistic Update: 목록에 임시 데이터 추가 (hooks에서 처리)
   */
  const createMutation = useCreateUser({
    onSuccess: () => {
      toast.success('사용자가 생성되었습니다');
      closeForm(); // Drawer 닫기 + 상태 초기화
    },
    onError: (error) => {
      // 에러 메시지 표시
      toast.error(error.message || '사용자 생성에 실패했습니다');
      // 디버깅용 콘솔 로그
      console.error('Failed to create user:', error);
    },
  });

  /**
   * 사용자 수정 Mutation
   * 
   * @description
   * - onSuccess: 성공 토스트 + Drawer 닫기
   * - onError: 에러 토스트 + 콘솔 로그
   * - Optimistic Update: 목록 + 상세 데이터 즉시 업데이트 (hooks에서 처리)
   */
  const updateMutation = useUpdateUser({
    onSuccess: () => {
      toast.success('사용자가 수정되었습니다');
      closeForm(); // Drawer 닫기 + 상태 초기화
    },
    onError: (error) => {
      // 에러 메시지 표시
      toast.error(error.message || '사용자 수정에 실패했습니다');
      // 디버깅용 콘솔 로그
      console.error('Failed to update user:', error);
    },
  });
  
  /**
   * 로딩 상태 통합
   *
   * @description
   * - 생성 또는 수정 중인지 확인
   * - 데이터 로딩 중인지 확인 (수정 모드)
   * - 로딩 중일 때 폼 제출 버튼 비활성화
   */
  const isLoading = createMutation.isPending || updateMutation.isPending || isUserLoading;

  // ============================================================
  // 4. 역할 목록 추출 (useMemo)
  // ============================================================
  
  /**
   * 중복 제거된 역할 목록 생성
   * 
   * @description
   * 사용자 목록에서 고유한 역할들을 추출하여 드롭다운 옵션 생성
   * - Map을 사용하여 role_id 기준으로 중복 제거
   * - role_id와 role_name이 모두 있는 경우만 포함
   * - useMemo로 최적화 (users 배열 변경 시에만 재계산)
   * 
   * @optimization
   * - useMemo: users 배열이 변경될 때만 재계산
   * - Map: O(1) 조회 시간으로 효율적인 중복 제거
   * 
   * @returns {{ id: string; name: string }[]} 역할 목록
   * 
   * @example
   * [
   *   { id: 'role-001', name: '관리자' },
   *   { id: 'role-002', name: '매니저' },
   *   { id: 'role-003', name: '사용자' }
   * ]
   */
  const uniqueRoles = useMemo(() => {
    // Map을 사용하여 중복 제거 (role_id가 키)
    const roleMap = new Map<string, { id: string; name: string }>();

    // 모든 사용자 순회
    users.forEach((user) => {
      // role_id와 role_name이 모두 있는 경우만 처리
      if (user.role_id && user.role_name) {
        // 이미 추가된 역할인지 확인 (Map의 has는 O(1))
        if (!roleMap.has(user.role_id)) {
          // 새로운 역할 추가
          roleMap.set(user.role_id, { id: user.role_id, name: user.role_name });
        }
      }
    });

    // Map의 values를 배열로 변환
    return Array.from(roleMap.values());
  }, [users]); // users 배열 변경 시에만 재계산

  // ============================================================
  // 5. 폼 제출 핸들러
  // ============================================================
  
  /**
   * 폼 제출 핸들러
   * 
   * @description
   * 생성 모드와 수정 모드를 구분하여 적절한 mutation 실행
   * - editingId가 있으면: 수정 mutation
   * - editingId가 없으면: 생성 mutation
   * 
   * @param formData - 폼에서 입력된 데이터
   * - CreateUserRequest: 생성 시 (username, email, password 필수)
   * - UpdateUserRequest: 수정 시 (모든 필드 선택적)
   * 
   * @flow
   * 1. editingId 확인
   * 2. 수정 모드: updateMutation.mutate({ id, data })
   * 3. 생성 모드: createMutation.mutate(data)
   * 4. Mutation 완료 시 onSuccess/onError 콜백 실행
   */
  const handleSubmit = (formData: CreateUserRequest | UpdateUserRequest) => {
    if (editingId) {
      // 수정 모드: 기존 사용자 업데이트
      updateMutation.mutate({ 
        id: editingId, 
        data: formData as UpdateUserRequest 
      });
    } else {
      // 생성 모드: 새 사용자 생성
      createMutation.mutate(formData as CreateUserRequest);
    }
  };

  // ============================================================
  // 6. UI 렌더링
  // ============================================================

  return (
    <EntityDrawer
      // Drawer 상태
      open={formOpen}
      onOpenChange={closeForm}
      
      // 타이틀 (생성/수정 모드에 따라 변경)
      title={editingId ? '사용자 수정' : '사용자 등록'}
      
      // 설명 (생성/수정 모드에 따라 변경)
      description={
        editingId
          ? '사용자 정보를 수정하세요.'
          : '새로운 사용자 정보를 입력하세요.'
      }
      
      // Drawer 너비 (md: 중간 크기)
      width="md"
    >
      {/* 사용자 폼 (Presentational Component) */}
      <UsersForm
        // 초기 데이터 (수정 모드일 때만 전달)
        initialData={editingUser}
        
        // 역할 목록 (드롭다운 옵션)
        roles={uniqueRoles}
        
        // 제출 핸들러
        onSubmit={handleSubmit}
        
        // 취소 핸들러 (Drawer 닫기)
        onCancel={closeForm}
        
        // 로딩 상태 (버튼 비활성화용)
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
