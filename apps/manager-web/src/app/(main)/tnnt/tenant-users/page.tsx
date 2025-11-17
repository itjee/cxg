/**
 * @file page.tsx
 * @description 테넌트 사용자 관리 페이지
 */

'use client';

import { toast } from 'sonner';
import {
  TenantUsersHeader,
  TenantUsersStats,
  TenantUsersFilters,
  TenantUsersTable,
  TenantUsersEdit,
  useTenantUsers,
  useDeleteTenantUser,
  useResetPassword,
  useTenantUsersStore,
} from '@/features/tnnt/tenant-users';

export default function TenantUsersPage() {
  const {
    searchText,
    selectedStatus,
    selectedTenantId,
    selectedRoleId,
    showPrimaryOnly,
    currentPage,
    itemsPerPage,
    openForm,
  } = useTenantUsersStore();

  // 목록 조회
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useTenantUsers({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    status: selectedStatus || undefined,
    tenant_id: selectedTenantId || undefined,
    role_id: selectedRoleId || undefined,
    is_primary: showPrimaryOnly || undefined,
  });

  // 삭제 mutation
  const deleteMutation = useDeleteTenantUser({
    onSuccess: () => toast.success('사용자가 삭제되었습니다'),
    onError: (error) => toast.error(error.message || '삭제 실패'),
  });

  // 비밀번호 재설정 mutation
  const resetPasswordMutation = useResetPassword({
    onSuccess: (data) => {
      toast.success(`임시 비밀번호: ${data.temporary_password}`, {
        duration: 10000,
      });
    },
    onError: (error) => toast.error(error.message || '비밀번호 재설정 실패'),
  });

  const users = usersResponse?.items || [];

  const handleEdit = (user: any) => {
    openForm(user.id);
  };

  const handleDelete = (user: any) => {
    if (user.is_primary) {
      toast.error('주 사용자는 삭제할 수 없습니다');
      return;
    }
    if (confirm(`사용자 "${user.username}"를 삭제하시겠습니까?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const handleResetPassword = (user: any) => {
    if (confirm(`사용자 "${user.username}"의 비밀번호를 재설정하시겠습니까?`)) {
      resetPasswordMutation.mutate(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">에러: {error.message}</p>
          <button onClick={() => refetch()} className="text-primary hover:underline">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TenantUsersHeader onRefresh={() => refetch()} />
      <TenantUsersStats data={users} />
      <TenantUsersFilters data={users} />
      <TenantUsersTable
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />
      <TenantUsersEdit />
    </div>
  );
}
