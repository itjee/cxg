/**
 * AssetDepreciation Feature - Index
 * 감가상각 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { AssetDepreciationHeader } from './components/asset-depreciation-header';
export { AssetDepreciationStats } from './components/asset-depreciation-stats';
export { AssetDepreciationFilters } from './components/asset-depreciation-filters';
export { AssetDepreciationList } from './components/asset-depreciation-list';
export { AssetDepreciationPaging } from './components/asset-depreciation-paging';
export { AssetDepreciationEdit } from './components/asset-depreciation-edit';

// Hooks
export {
  useAssetDepreciation,
  useAssetDepreciationById,
  useCreateAssetDepreciation,
  useUpdateAssetDepreciation,
  useDeleteAssetDepreciation,
} from './hooks';

// Services
export { assetDepreciationService } from './services';

// Types
export type {
  AssetDepreciation,
  CreateAssetDepreciationRequest,
  UpdateAssetDepreciationRequest,
  AssetDepreciationListResponse,
  AssetDepreciationDetailResponse,
  AssetDepreciationQueryParams,
} from './types';
