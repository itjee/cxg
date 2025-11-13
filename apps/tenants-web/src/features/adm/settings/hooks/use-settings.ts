import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService } from "../services/settings.service";
import { useSettingStore } from "../stores/settings.store";
import type {
  Setting,
  CreateSettingRequest,
  UpdateSettingRequest,
  SettingValueType,
  SettingListResponse,
} from "../types/settings.types";
import { useCallback } from "react";

// 쿼리 키 정의
const settingQueryKeys = {
  all: ["tenants", "adm", "settings"] as const,
  lists: () => [...settingQueryKeys.all, "list"] as const,
  list: (filters: any) => [...settingQueryKeys.lists(), filters] as const,
  details: () => [...settingQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...settingQueryKeys.details(), id] as const,
};

/**
 * 설정정보 목록 조회 훅
 */
export function useSettingList() {
  const { selectedCategory, selectedStatus, currentPage } =
    useSettingStore();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: settingQueryKeys.list({
      selectedCategory,
      selectedStatus,
      currentPage,
    }),
    queryFn: () =>
      settingService.getSettings({
        category: selectedCategory || undefined,
        is_active:
          selectedStatus === "active"
            ? true
            : selectedStatus === "inactive"
            ? false
            : undefined,
        page: Math.max(1, currentPage + 1),
        page_size: 20,
      }),
    retry: 1,
    staleTime: 1000 * 60, // 1분
  });

  const settings = data?.items || [];

  return {
    settings,
    listData: data,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * 단일 설정정보 조회 훅
 */
export function useSettingById(id: string | null) {
  const {
    data: setting,
    isLoading,
    error,
  } = useQuery({
    queryKey: settingQueryKeys.detail(id || ""),
    queryFn: () => settingService.getSettingById(id!),
    enabled: !!id,
    retry: 1,
  });

  return { setting, isLoading, error };
}

/**
 * 설정정보 생성 훅
 */
export function useCreateSetting() {
  const queryClient = useQueryClient();
  const { closeForm } = useSettingStore();

  const mutation = useMutation({
    mutationFn: (data: CreateSettingRequest) =>
      settingService.createSetting(data),
    onSuccess: (newSetting) => {
      // 리스트 무효화
      queryClient.invalidateQueries({ queryKey: settingQueryKeys.lists() });

      // 새로운 설정 캐시에 추가
      queryClient.setQueryData(
        settingQueryKeys.detail(newSetting.id),
        newSetting
      );

      closeForm();
    },
    onError: (error) => {
      console.error("설정 생성 실패:", error);
    },
  });

  return {
    createSetting: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 설정정보 수정 훅
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { closeForm } = useSettingStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSettingRequest }) =>
      settingService.updateSetting(id, data),
    onSuccess: (updatedSetting) => {
      // 리스트 무효화
      queryClient.invalidateQueries({ queryKey: settingQueryKeys.lists() });

      // 상세 캐시 업데이트
      queryClient.setQueryData(
        settingQueryKeys.detail(updatedSetting.id),
        updatedSetting
      );

      closeForm();
    },
    onError: (error) => {
      console.error("설정 수정 실패:", error);
    },
  });

  return {
    updateSetting: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 설정정보 삭제 훅
 */
export function useDeleteSetting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => settingService.deleteSetting(id),
    onSuccess: () => {
      // 리스트 무효화
      queryClient.invalidateQueries({ queryKey: settingQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("설정 삭제 실패:", error);
    },
  });

  return {
    deleteSetting: useCallback(
      (id: string) => {
        // 삭제 전 확인
        if (confirm("이 설정을 삭제하시겠습니까?")) {
          mutation.mutate(id);
        }
      },
      [mutation]
    ),
    isDeleting: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 설정정보 통계 훅
 */
export function useSettingStats() {
  const { settings, listData } = useSettingList();

  const byType: Record<SettingValueType, number> = {
    STRING: settings.filter((s) => s.value_type === "STRING").length,
    NUMBER: settings.filter((s) => s.value_type === "NUMBER").length,
    BOOLEAN: settings.filter((s) => s.value_type === "BOOLEAN").length,
    JSON: settings.filter((s) => s.value_type === "JSON").length,
  };

  const stats = {
    total: listData?.total || 0,
    active: settings.filter((s) => s.is_active).length,
    inactive: settings.filter((s) => !s.is_active).length,
    byType,
  };

  return stats;
}
