"use client";

import { toast } from "sonner";
import {
  RolesHeader,
  RolesStats,
  RolesFilters,
  RolesTable,
  RolesEdit,
  useRoles,
  useDeleteRole,
} from "@/features/idam/roles";
import { useRolesStore } from "@/features/idam/roles/stores/roles.store";

export default function RolesPage() {
  const { selectedStatus, globalFilter } = useRolesStore();

  const { data: rolesResponse, refetch, loading } = useRoles({
    limit: 20,
    offset: 0,
    status: selectedStatus || undefined,
  });

  const [deleteRole] = useDeleteRole();

  const roles = rolesResponse?.roles || [];

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (confirm(`'${roleName}' 역할을 삭제하시겠습니까?`)) {
      try {
        await deleteRole({
          variables: { id: roleId },
        });
        toast.success("역할이 삭제되었습니다");
      } catch (error) {
        const message = error instanceof Error ? error.message : "역할 삭제에 실패했습니다";
        toast.error(message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <RolesHeader onRefresh={() => refetch?.()} />
      <RolesStats data={roles} />
      <RolesFilters />
      <RolesTable
        data={roles}
        isLoading={loading}
        onEdit={(role) => useRolesStore.getState().openForm(role.id)}
        onDelete={(role) => handleDeleteRole(role.id, role.name)}
      />
      <RolesEdit />
    </div>
  );
}
