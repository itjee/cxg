"use client";

/**
 * Users List Page
 *
 * Manager Users 목록 페이지
 * Apollo GraphQL Hooks를 사용합니다.
 */

import { toast } from "sonner";
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useUpdateUser,
  useUsersStore,
} from "@/features/idam/users";

export default function UsersPage() {
  // Store에서 UI 상태 가져오기
  const { selectedStatus, currentPage, itemsPerPage } =
    useUsersStore();

  // GraphQL 쿼리 - Apollo Hooks 사용
  const {
    data: usersResponse,
    loading,
    refetch,
  } = useUsers({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    userType: undefined,
    status: selectedStatus || undefined,
  });

  // GraphQL 뮤테이션 - 수정
  const [updateUser, { loading: updating }] = useUpdateUser();

  // 사용자 데이터
  const users = usersResponse?.users || [];

  const handleDelete = async (user: any) => {
    if (confirm(`'${user.fullName}' 사용자를 삭제하시겠습니까?`)) {
      try {
        await updateUser({
          variables: {
            id: user.id,
            input: { status: "INACTIVE" },
          },
        });
        toast.success("사용자가 삭제되었습니다");
        refetch();
      } catch (error) {
        toast.error("사용자 삭제에 실패했습니다");
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="space-y-6 p-6">
      <UsersHeader onRefresh={() => refetch()} />
      <UsersStats data={users} />
      <UsersFilters />
      <UsersTable data={users} isLoading={updating} onDelete={handleDelete} />
      <UsersEdit />
    </div>
  );
}
