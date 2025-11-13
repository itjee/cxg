/**
 * ApprovalHistories Feature - Index
 * 결재 이력 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { ApprovalHistoriesHeader } from './components/approval-histories-header';
export { ApprovalHistoriesStats } from './components/approval-histories-stats';
export { ApprovalHistoriesFilters } from './components/approval-histories-filters';
export { ApprovalHistoriesList } from './components/approval-histories-list';
export { ApprovalHistoriesPaging } from './components/approval-histories-paging';
export { ApprovalHistoriesEdit } from './components/approval-histories-edit';

// Hooks
export {
  useApprovalHistories,
  useApprovalHistoriesById,
  useCreateApprovalHistories,
  useUpdateApprovalHistories,
  useDeleteApprovalHistories,
} from './hooks';

// Services
export { approvalHistoriesService } from './services';

// Types
export type {
  ApprovalHistories,
  CreateApprovalHistoriesRequest,
  UpdateApprovalHistoriesRequest,
  ApprovalHistoriesListResponse,
  ApprovalHistoriesDetailResponse,
  ApprovalHistoriesQueryParams,
} from './types';
