/**
 * FixedAssets Feature - Index
 * 고정자산 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { FixedAssetsHeader } from './components/fixed-assets-header';
export { FixedAssetsStats } from './components/fixed-assets-stats';
export { FixedAssetsFilters } from './components/fixed-assets-filters';
export { FixedAssetsList } from './components/fixed-assets-list';
export { FixedAssetsPaging } from './components/fixed-assets-paging';
export { FixedAssetsEdit } from './components/fixed-assets-edit';

// Hooks
export {
  useFixedAssets,
  useFixedAssetsById,
  useCreateFixedAssets,
  useUpdateFixedAssets,
  useDeleteFixedAssets,
} from './hooks';

// Services
export { fixedAssetsService } from './services';

// Types
export type {
  FixedAssets,
  CreateFixedAssetsRequest,
  UpdateFixedAssetsRequest,
  FixedAssetsListResponse,
  FixedAssetsDetailResponse,
  FixedAssetsQueryParams,
} from './types';
