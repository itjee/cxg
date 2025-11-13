/**
 * @file use-tenants.ts
 * @description 테넌트 관리 React Query hooks
 * 
 * 서버 상태를 관리하는 TanStack Query 훅 컬렉션
 * - useTenants: 목록 조회
 * - useTenant: 상세 조회
 * - useCreateTenant: 생성
 * - useUpdateTenant: 수정
 * - useDeleteTenant: 삭제
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useTenants({ page: 0, pageSize: 20 });
 * const createMutation = useCreateTenant();
 * createMutation.mutate({ name: '테넌트명' });
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "../services";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  TenantQueryParams,
} from "../types";

/**
 * Query Key Factory
 */
export const tenantsKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantsKeys.all, "list"] as const,
  list: (params?: TenantQueryParams) => [...tenantsKeys.lists(), params] as const,
  detail: (id: string) => [...tenantsKeys.all, "detail", id] as const,
};

/**
 * 목록 조회 훅
 * 
 * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
 * @returns useQuery result
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useTenants({ 
 *   page: 0, 
 *   pageSize: 20,
 *   search: '검색어',
 *   active: true
 * });
 * ```
 */
export function useTenants(params?: TenantQueryParams) {
  return useQuery({
    queryKey: tenantsKeys.list(params),
    queryFn: () => tenantService.listTenants(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

/**
 * 상세 조회 훅
 * 
 * @param id - 테넌트 ID
 * @returns useQuery result
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useTenant('uuid');
 * const tenant = data?.data;
 * ```
 */
export function useTenant(id: string | null | undefined) {
  return useQuery({
    queryKey: tenantsKeys.detail(id!),
    queryFn: () => tenantService.getTenant(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 생성 훅
 * 
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const createMutation = useCreateTenant();
 * 
 * createMutation.mutate({
 *   name: '테넌트명',
 *   description: '설명'
 * }, {
 *   onSuccess: () => console.log('생성 성공'),
 *   onError: (error) => console.error('생성 실패', error)
 * });
 * ```
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to create tenant:", error);
    },
  });
}

/**
 * 수정 훅
 * 
 * @param id - 테넌트 ID
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const updateMutation = useUpdateTenant('uuid');
 * 
 * updateMutation.mutate({
 *   name: '변경된 이름'
 * }, {
 *   onSuccess: () => console.log('수정 성공')
 * });
 * ```
 */
export function useUpdateTenant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTenantRequest) => tenantService.updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantsKeys.detail(id) });
    },
    onError: (error) => {
      console.error(`Failed to update tenant ${id}:`, error);
    },
  });
}

/**
 * 삭제 훅
 * 
 * @param id - 테넌트 ID
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const deleteMutation = useDeleteTenant('uuid');
 * 
 * deleteMutation.mutate(undefined, {
 *   onSuccess: () => console.log('삭제 성공')
 * });
 * ```
 */
export function useDeleteTenant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tenantService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsKeys.lists() });
    },
    onError: (error) => {
      console.error(`Failed to delete tenant ${id}:`, error);
    },
  });
}
