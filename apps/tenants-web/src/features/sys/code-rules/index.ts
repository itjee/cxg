/**
 * Code Rules Feature - Index
 * 코드 규칙 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { CodeRulesHeader } from "./components/code-rules-header";
export { CodeRulesStats } from "./components/code-rules-stats";
export { CodeRulesFilters } from "./components/code-rules-filters";
export { CodeRulesList } from "./components/code-rules-table";
export { CodeRulesPaging } from "./components/code-rules-paging";
export { CodeRulesEdit } from "./components/code-rules-edit";

// Hooks
export {
  useCodeRules,
  useCodeRule,
  useCreateCodeRule,
  useUpdateCodeRule,
  useDeleteCodeRule,
  useToggleCodeRuleActive,
} from "./hooks";

// Services
export { codeRuleService } from "./services";

// Types
export type {
  CodeRule,
  CreateCodeRuleRequest,
  UpdateCodeRuleRequest,
  CodeRuleListResponse,
  CodeRuleDetailResponse,
  CodeRuleQueryParams,
} from "./types";
