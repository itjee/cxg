/**
 * Roles Feature - Index
 * 역할 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { RolesHeader } from "./components/roles-header";
export { RolesStats } from "./components/roles-stats";
export { RolesFilters } from "./components/roles-filters";
export { RolesList } from "./components/roles-table";
export { RolesPaging } from "./components/roles-paging";
export { RolesEdit } from "./components/roles-edit";

// Hooks
export {
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useToggleRoleActive,
} from "./hooks";

// Services
export { roleService } from "./services";

// Types
export type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleListResponse,
  RoleDetailResponse,
  RoleQueryParams,
} from "./types";
