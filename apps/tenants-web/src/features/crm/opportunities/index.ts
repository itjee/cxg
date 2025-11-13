/**
 * Opportunities Feature - Index
 * 영업기회 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { OpportunitiesHeader } from './components/opportunities-header';
export { OpportunitiesStats } from './components/opportunities-stats';
export { OpportunitiesFilters } from './components/opportunities-filters';
export { OpportunitiesTable } from './components/opportunities-table';
export { OpportunitiesPaging } from './components/opportunities-paging';
export { OpportunitiesEdit } from './components/opportunities-edit';

// Hooks
export {
  useOpportunities,
  useOpportunity,
  useCreateOpportunity,
  useUpdateOpportunity,
  useDeleteOpportunity,
} from './hooks';

// Services
export { opportunityService } from './services';

// Types
export type {
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  OpportunityListResponse,
  OpportunityDetailResponse,
  OpportunityQueryParams,
} from './types';
