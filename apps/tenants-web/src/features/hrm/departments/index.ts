/**
 * Departments Feature - Index
 * 부서 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { DepartmentsHeader } from './components/departments-header';
export { DepartmentsStats } from './components/departments-stats';
export { DepartmentsFilters } from './components/departments-filters';
export { DepartmentsList } from './components/departments-list';
export { DepartmentsPaging } from './components/departments-paging';
export { DepartmentsEdit } from './components/departments-edit';

// Hooks
export {
  useDepartments,
  useDepartment,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from './hooks';

// Services
export { departmentService } from './services';

// Types
export type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentListResponse,
  DepartmentDetailResponse,
  DepartmentQueryParams,
} from './types';

// Stores
export { useDepartmentsStore } from './stores';

