/**
 * @file page.tsx
 * @description 테넌트 역할 관리 페이지
 */

'use client';

import { toast } from 'sonner';
import {
  TenantRolesHeader,
  TenantRolesStats,
  TenantRolesFilters,
  TenantRolesTable,
  TenantRolesEdit,
  useTenantRoles,
  useDeleteTenantRole,
  useTenantRolesStore,
} from '@/features/tnnt/tenant-roles';

export default function TenantRolesPage() {
  const {
    searchText,
    selectedStatus,
    selectedTenantId,
    showSystemRoles,
    currentPage,
    itemsPerPage,
    openForm,
  } = useTenantRolesStore();

  // 목록 조회
  const {
    data: rolesResponse,
    isLoading,
    error,
    refetch,
  } = useTenantRoles({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    status: selectedStatus || undefined,
    tenant_id: selectedTenantId || undefined,
    is_system_role: showSystemRoles ? undefined : false,
  });

  // 삭제 mutation
  const deleteMutation = useDeleteTenantRole({
    onSuccess: () => toast.success('역할이 삭제되었습니다'),
    onError: (error) => toast.error(error.message || '삭제 실패'),
  });

  const roles = rolesResponse?.items || [];

  const handleEdit = (role: any) => {
    openForm(role.id);
  };

  const handleDelete = (role: any) => {
    if (role.is_system_role) {
      toast.error('시스템 역할은 삭제할 수 없습니다');
      return;
    }
    if (confirm(`역할 "${role.role_name}"을 삭제하시겠습니까?`)) {
      deleteMutation.mutate(role.id);
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
    <div className="space-y-6 p-6">
      <TenantRolesHeader onRefresh={() => refetch()} />
      <TenantRolesStats data={roles} />
      <TenantRolesFilters data={roles} />
      <TenantRolesTable data={roles} onEdit={handleEdit} onDelete={handleDelete} />
      <TenantRolesEdit />
    </div>
  );
}
