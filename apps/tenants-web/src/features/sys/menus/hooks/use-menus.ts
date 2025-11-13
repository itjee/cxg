/**
 * @file use-menus.ts
 * @description TanStack Query를 사용한 메뉴 데이터 관리 훅
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../services/menus.service";
import type {
  Menu,
  CreateMenuRequest,
  UpdateMenuRequest,
  MenuQueryParams,
} from "../types";

/**
 * 쿼리 키 팩토리 패턴
 * 
 * @description 메뉴 관련 React Query 쿼리 키 생성
 */
const menusKeys = {
  all: ["menus"] as const,
  lists: () => [...menusKeys.all, "list"] as const,
  list: (params?: MenuQueryParams) => [...menusKeys.lists(), params] as const,
  details: () => [...menusKeys.all, "detail"] as const,
  detail: (id: string) => [...menusKeys.details(), id] as const,
  tree: () => [...menusKeys.all, "tree"] as const,
};

/**
 * 메뉴 목록 조회 훅
 * 
 * @param params - 조회 파라미터 (페이징, 필터 등)
 * @returns React Query 쿼리 결과
 */
export function useMenus(params?: MenuQueryParams) {
  return useQuery({
    queryKey: menusKeys.list(params),
    queryFn: () => menuService.listMenus(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 메뉴 상세 조회 훅
 * 
 * @param id - 메뉴 ID
 * @returns React Query 쿼리 결과
 */
export function useMenu(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? menusKeys.detail(id) : [],
    queryFn: () => menuService.getMenu(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 메뉴 트리 구조 조회 훅
 * 
 * @returns React Query 쿼리 결과
 */
export function useMenuTree() {
  return useQuery({
    queryKey: menusKeys.tree(),
    queryFn: () => menuService.getMenuTree(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * 메뉴 생성 훅
 * 
 * @param options - 성공/실패 콜백 옵션
 * @returns React Query 뮤테이션 결과
 */
export function useCreateMenu(options?: {
  onSuccess?: (menu: Menu) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuRequest) => menuService.createMenu(data),
    onMutate: async (newMenu) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: menusKeys.lists() });

      // 이전 데이터 스냅샷
      const previousMenus = queryClient.getQueryData(menusKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: menusKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...(old.data || []),
            { ...newMenu, id: "temp-id", created_at: new Date().toISOString() },
          ],
        };
      });

      return { previousMenus };
    },
    onSuccess: (newMenu) => {
      queryClient.invalidateQueries({ queryKey: menusKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
      options?.onSuccess?.(newMenu);
    },
    onError: (error, variables, context) => {
      // 롤백
      if (context?.previousMenus) {
        queryClient.setQueryData(menusKeys.lists(), context.previousMenus);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menusKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
    },
    retry: 1,
  });
}

/**
 * 메뉴 수정 훅
 * 
 * @param options - 성공/실패 콜백 옵션
 * @returns React Query 뮤테이션 결과
 */
export function useUpdateMenu(options?: {
  onSuccess?: (menu: Menu) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuRequest }) =>
      menuService.updateMenu(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: menusKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: menusKeys.lists() });

      const previousMenu = queryClient.getQueryData(menusKeys.detail(id));
      const previousList = queryClient.getQueryData(menusKeys.lists());

      // Optimistic Update - 상세
      queryClient.setQueryData(menusKeys.detail(id), (old: any) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      // Optimistic Update - 목록
      queryClient.setQueriesData({ queryKey: menusKeys.lists() }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((menu: Menu) =>
            menu.id === id ? { ...menu, ...data } : menu
          ),
        };
      });

      return { previousMenu, previousList, id };
    },
    onSuccess: (updatedMenu, { id }) => {
      queryClient.setQueryData(menusKeys.detail(id), updatedMenu);
      queryClient.invalidateQueries({ queryKey: menusKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
      options?.onSuccess?.(updatedMenu);
    },
    onError: (error, { id }, context) => {
      if (context?.previousMenu) {
        queryClient.setQueryData(menusKeys.detail(id), context.previousMenu);
      }
      if (context?.previousList) {
        queryClient.setQueryData(menusKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: menusKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
    },
    retry: 1,
  });
}

/**
 * 메뉴 삭제 훅
 * 
 * @param options - 성공/실패 콜백 옵션
 * @returns React Query 뮤테이션 결과
 */
export function useDeleteMenu(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuService.deleteMenu(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: menusKeys.lists() });

      const previousList = queryClient.getQueryData(menusKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: menusKeys.lists() }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((menu: Menu) => menu.id !== id),
        };
      });

      return { previousList, id };
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: menusKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: menusKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
      options?.onSuccess?.();
    },
    onError: (error, id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(menusKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menusKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menusKeys.tree() });
    },
    retry: 1,
  });
}
