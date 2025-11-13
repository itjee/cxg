import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services';
import { useDepartmentsStore } from '../stores';
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentQueryParams,
} from '../types';

// 쿼리 키 정의
const departmentQueryKeys = {
  all: ['tenants', 'hrm', 'departments'] as const,
  lists: () => [...departmentQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...departmentQueryKeys.lists(), filters] as const,
  details: () => [...departmentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentQueryKeys.details(), id] as const,
};

/**
 * 부서 목록 조회 훅
 */
export function useDepartments() {
  const { selectedStatus, currentPage } = useDepartmentsStore();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: departmentQueryKeys.list({
      selectedStatus,
      currentPage,
    }),
    queryFn: () =>
      departmentService.getDepartments({
        is_active:
          selectedStatus === 'active'
            ? true
            : selectedStatus === 'inactive'
            ? false
            : undefined,
        page: Math.max(1, currentPage + 1),
        page_size: 20,
      }),
    retry: 1,
    staleTime: 1000 * 60, // 1분
  });

  const departments = data?.items || [];

  return {
    departments,
    listData: data,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * 단일 부서 조회 훅
 */
export function useDepartment(id: string | null) {
  const { data: department, isLoading, error } = useQuery({
    queryKey: departmentQueryKeys.detail(id || ''),
    queryFn: () => departmentService.getDepartmentById(id!),
    enabled: !!id,
    retry: 1,
  });

  return { department, isLoading, error };
}

/**
 * 부서 생성 훅
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { closeForm } = useDepartmentsStore();

  const mutation = useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentService.createDepartment(data),
    onSuccess: (newDepartment) => {
      queryClient.invalidateQueries({ queryKey: departmentQueryKeys.lists() });
      queryClient.setQueryData(departmentQueryKeys.detail(newDepartment.id), newDepartment);
      closeForm();
    },
    onError: (error) => {
      console.error('부서 생성 실패:', error);
    },
  });

  return {
    createDepartment: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 부서 수정 훅
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const { closeForm } = useDepartmentsStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: (updatedDepartment) => {
      queryClient.invalidateQueries({ queryKey: departmentQueryKeys.lists() });
      queryClient.setQueryData(departmentQueryKeys.detail(updatedDepartment.id), updatedDepartment);
      closeForm();
    },
    onError: (error) => {
      console.error('부서 수정 실패:', error);
    },
  });

  return {
    updateDepartment: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 부서 삭제 훅
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('부서 삭제 실패:', error);
    },
  });

  return {
    deleteDepartment: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}
