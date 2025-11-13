import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../services';
import { useEmployeeStore } from '../stores';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQueryParams,
} from '../types';

// 쿼리 키 정의
const employeeQueryKeys = {
  all: ['tenants', 'hrm', 'employees'] as const,
  lists: () => [...employeeQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...employeeQueryKeys.lists(), filters] as const,
  details: () => [...employeeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeQueryKeys.details(), id] as const,
};

/**
 * 직원 목록 조회 훅
 */
export function useEmployees() {
  const { globalFilter, selectedDepartment, selectedStatus, currentPage } = useEmployeeStore();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: employeeQueryKeys.list({
      globalFilter,
      selectedDepartment,
      selectedStatus,
      currentPage,
    }),
    queryFn: () =>
      employeeService.getEmployees({
        search: globalFilter || undefined,
        department_id: selectedDepartment || undefined,
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

  const employees = data?.items || [];

  return {
    employees,
    listData: data,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * 단일 직원 조회 훅
 */
export function useEmployee(id: string | null) {
  const { data: employee, isLoading, error } = useQuery({
    queryKey: employeeQueryKeys.detail(id || ''),
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
    retry: 1,
  });

  return { employee, isLoading, error };
}

/**
 * 직원 생성 훅
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { closeForm } = useEmployeeStore();

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeeService.createEmployee(data),
    onSuccess: (newEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.lists() });
      queryClient.setQueryData(employeeQueryKeys.detail(newEmployee.id), newEmployee);
      closeForm();
    },
    onError: (error) => {
      console.error('직원 생성 실패:', error);
    },
  });

  return {
    createEmployee: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 직원 수정 훅
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { closeForm } = useEmployeeStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.lists() });
      queryClient.setQueryData(employeeQueryKeys.detail(updatedEmployee.id), updatedEmployee);
      closeForm();
    },
    onError: (error) => {
      console.error('직원 수정 실패:', error);
    },
  });

  return {
    updateEmployee: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * 직원 삭제 훅
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('직원 삭제 실패:', error);
    },
  });

  return {
    deleteEmployee: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}
