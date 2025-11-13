/**
 * Partners Feature - Index
 * 거래처/고객 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { PartnersHeader } from './components/partners-header';
export { PartnersStats } from './components/partners-stats';
export { PartnersFilters } from './components/partners-filters';
export { PartnersTable } from './components/partners-table';
export { PartnersPaging } from './components/partners-paging';
export { PartnersEdit } from './components/partners-edit';

// Hooks
export {
  usePartners,
  usePartner,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from './hooks';

// Services
export { partnerService } from './services';

// Types
export type {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerListResponse,
  PartnerDetailResponse,
  PartnerQueryParams,
} from './types';
