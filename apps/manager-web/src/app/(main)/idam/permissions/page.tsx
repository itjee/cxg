'use client';

import { toast } from 'sonner';
import {
  PermissionsHeader,
  PermissionsStats,
  PermissionsFilters,
  PermissionsTable,
  PermissionsEdit,
  usePermissions,
  useDeletePermissions,
} from '@/features/idam/permissions';
import { usePermissionsStore } from '@/features/idam/permissions/stores/permissions.store';

export default function PermissionsPage() {
  const { selectedStatus, currentPage, itemsPerPage, globalFilter } = usePermissionsStore();

  const { data: permissionsResponse, refetch } = usePermissions({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
  });

  const deletePermissionMutation = useDeletePermissions({
    onSuccess: () => toast.success('권한이 삭제되었습니다'),
    onError: (error) => toast.error(error.message || '권한 삭제에 실패했습니다'),
  });

  const permissions = permissionsResponse?.items || [];
  const totalItems = permissionsResponse?.total || 0;

  return (
    <div className="space-y-6">
      <PermissionsHeader onRefresh={() => refetch()} />
      <PermissionsStats permissions={permissions} />
      <PermissionsFilters permissions={permissions} />
      <PermissionsTable
        data={permissions}
        totalItems={totalItems}
        onEdit={(permission) => usePermissionsStore.getState().openForm(permission.id)}
        onDelete={(permission) => {
          if (confirm(`'${permission.name}' 권한을 삭제하시겠습니까?`)) {
            deletePermissionMutation.mutate(permission.id);
          }
        }}
      />
      <PermissionsEdit permissions={permissions} />
    </div>
  );
}
