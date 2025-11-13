/**
 * Permissions Feature - Index
 * 권한 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { PermissionsHeader } from "./components/permissions-header";
export { PermissionsStats } from "./components/permissions-stats";
export { PermissionsFilters } from "./components/permissions-filters";
export { PermissionsList } from "./components/permissions-table";
export { PermissionsPaging } from "./components/permissions-paging";
export { PermissionsEdit } from "./components/permissions-edit";

// Hooks
export {
  usePermissions,
  usePermission,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  useTogglePermissionActive,
} from "./hooks";

// Services
export { permissionService } from "./services";

// Types
export type {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionListResponse,
  PermissionDetailResponse,
  PermissionQueryParams,
} from "./types";
