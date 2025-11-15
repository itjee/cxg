"use client";

import { toast } from "sonner";
import {
  RolesHeader,
  RolesStats,
  RolesFilters,
  RolesTable,
  RolesEdit,
  useRoles,
  useDeleteRoles,
} from "@/features/idam/roles";
import { useRolesStore } from "@/features/idam/roles/stores/roles.store";

export default function RolesPage() {
  const { selectedStatus, currentPage, itemsPerPage, globalFilter } =
    useRolesStore();

  const { data: rolesResponse, refetch } = useRoles({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active:
      selectedStatus === "active"
        ? true
        : selectedStatus === "inactive"
        ? false
        : undefined,
  });

  const deleteRoleMutation = useDeleteRoles({
    onSuccess: () => toast.success("역할이 삭제되었습니다"),
    onError: (error) =>
      toast.error(error.message || "역할 삭제에 실패했습니다"),
  });

  const roles = rolesResponse?.items || [];
  const totalItems = rolesResponse?.total || 0;

  return (
    <div className="space-y-6">
      <RolesHeader onRefresh={() => refetch()} />
      <RolesStats roles={roles} />
      <RolesFilters roles={roles} />
      <RolesTable
        data={roles}
        onEdit={(role) => useRolesStore.getState().openForm(role.id)}
        onDelete={(role) => {
          if (confirm(`'${role.name}' 역할을 삭제하시겠습니까?`)) {
            deleteRoleMutation.mutate(role.id);
          }
        }}
      />
      <RolesEdit roles={roles} />
    </div>
  );
}
