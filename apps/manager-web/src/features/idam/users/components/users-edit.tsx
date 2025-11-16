"use client";

/**
 * Users Edit Dialog
 *
 * 사용자 생성/수정 Dialog 컴포넌트
 * Apollo GraphQL Hooks를 사용합니다.
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { UsersForm } from "./users-form";
import { useUsersStore } from "../stores/users.store";
import {
  useUser,
  useCreateUser,
  useUpdateUser,
} from "../hooks";

export function UsersEdit() {
  const { formOpen, selectedId, closeForm } = useUsersStore();

  // 수정 모드: 선택된 사용자 조회 (단수)
  const { data: userResponse } = useUser(selectedId || "");
  const editingUser = userResponse?.user;

  // Apollo Mutation Hooks (튜플 반환)
  const [createUser, { loading: createLoading }] = useCreateUser();
  const [updateUser, { loading: updateLoading }] = useUpdateUser();

  const isLoading = createLoading || updateLoading;

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedId) {
        // 수정 모드: password 제외
        const { password, ...updateData } = formData;
        await updateUser({
          variables: {
            id: selectedId,
            input: updateData,
          },
        });

        toast.success("사용자가 수정되었습니다");
        closeForm();
      } else {
        // 생성 모드: 전체 데이터 전송 (camelCase 유지)
        await createUser({
          variables: {
            input: formData,
          },
        });

        toast.success("사용자가 생성되었습니다");
        closeForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        selectedId ? "사용자 수정 실패: " + message : "사용자 생성 실패: " + message
      );
      console.error("Failed to save user:", error);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={selectedId ? "사용자 수정" : "사용자 등록"}
      description={
        selectedId
          ? "사용자 정보를 수정하세요."
          : "새로운 사용자 정보를 입력하세요."
      }
      width="md"
    >
      <UsersForm
        initialData={editingUser}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
