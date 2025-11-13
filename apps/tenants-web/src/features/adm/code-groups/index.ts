/**
 * CodeGroups Feature - Index
 * 코드그룹 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { CodeGroupsHeader } from "./components/code-groups-header";
export { CodeGroupsStats } from "./components/code-groups-stats";
export { CodeGroupsFilters } from "./components/code-groups-filters";
export { CodeGroupsList } from "./components/code-groups-table";
export { CodeGroupsPaging } from "./components/code-groups-paging";
export { CodeGroupsEdit } from "./components/code-groups-edit";

// Hooks
export {
  useCodeGroups,
  useCodeGroup,
  useCodeGroupStats,
  useCreateCodeGroup,
  useDeleteCodeGroup,
  useUpdateCodeGroup,
} from "./hooks";

// Services
export { codeGroupService } from "./services";

// Types
export type {
  CodeGroup,
  CreateCodeGroupRequest,
  UpdateCodeGroupRequest,
} from "./types";

// Stores
export { useCodeGroupStore } from "./stores";
