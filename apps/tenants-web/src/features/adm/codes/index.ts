/**
 * Codes Feature - Index
 * 코드 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { CodesHeader } from "./components/codes-header";
export { CodesStats } from "./components/codes-stats";
export { CodesFilters } from "./components/codes-filters";
export { CodesList } from "./components/codes-table";
export { CodesPaging } from "./components/codes-paging";
export { CodesEdit } from "./components/codes-edit";

// Hooks
export {
  useCodes,
  useCode,
  useCodeStats,
  useCreateCode,
  useDeleteCode,
  useUpdateCode,
} from "./hooks";

// Services
export { codeService } from "./services";

// Types
export type {
  Code,
  CreateCodeRequest,
  UpdateCodeRequest,
} from "./types/codes.types";

// Stores
export { useCodeStore } from "./stores";
