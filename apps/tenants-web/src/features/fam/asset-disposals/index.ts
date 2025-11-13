/**
 * AssetDisposals Feature - Index
 * 자산 폐기/판매 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { AssetDisposalsHeader } from './components/asset-disposals-header';
export { AssetDisposalsStats } from './components/asset-disposals-stats';
export { AssetDisposalsFilters } from './components/asset-disposals-filters';
export { AssetDisposalsList } from './components/asset-disposals-list';
export { AssetDisposalsPaging } from './components/asset-disposals-paging';
export { AssetDisposalsEdit } from './components/asset-disposals-edit';

// Hooks
export {
  useAssetDisposals,
  useAssetDisposalsById,
  useCreateAssetDisposals,
  useUpdateAssetDisposals,
  useDeleteAssetDisposals,
} from './hooks';

// Services
export { assetDisposalsService } from './services';

// Types
export type {
  AssetDisposals,
  CreateAssetDisposalsRequest,
  UpdateAssetDisposalsRequest,
  AssetDisposalsListResponse,
  AssetDisposalsDetailResponse,
  AssetDisposalsQueryParams,
} from './types';
