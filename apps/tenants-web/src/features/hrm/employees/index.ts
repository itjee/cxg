/**
 * Employees Feature - Index
 * 직원 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { EmployeesHeader } from './components/employees-header';
export { EmployeesStats } from './components/employees-stats';
export { EmployeesFilters } from './components/employees-filters';
export { EmployeesList } from './components/employees-list';
export { EmployeesPaging } from './components/employees-paging';
export { EmployeesEdit } from './components/employees-edit';

// Hooks
export {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from './hooks';

// Services
export { employeeService } from './services';

// Types
export type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeDetailResponse,
  EmployeeQueryParams,
} from './types';

// Stores
export { useEmployeeStore } from './stores';

