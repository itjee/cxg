'use client';

import { toast } from 'sonner';
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useDeleteUsers,
} from '@/features/idam/users';
import { useUsersStore } from '@/features/idam/users/stores/users.store';

export default function UsersPage() {
  const { selectedStatus, currentPage, itemsPerPage, globalFilter } = useUsersStore();

  const { data: usersResponse, refetch } = useUsers({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
  });

  const deleteUserMutation = useDeleteUsers({
    onSuccess: () => toast.success('사용자가 삭제되었습니다'),
    onError: (error) => toast.error(error.message || '사용자 삭제에 실패했습니다'),
  });

  const users = usersResponse?.items || [];
  const totalItems = usersResponse?.total || 0;

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={() => refetch()} />
      <UsersStats users={users} />
      <UsersFilters users={users} />
      <UsersTable
        data={users}
        totalItems={totalItems}
        onEdit={(user) => useUsersStore.getState().openForm(user.id)}
        onDelete={(user) => {
          if (confirm(`'${user.name}' 사용자를 삭제하시겠습니까?`)) {
            deleteUserMutation.mutate(user.id);
          }
        }}
      />
      <UsersEdit users={users} />
    </div>
  );
}
