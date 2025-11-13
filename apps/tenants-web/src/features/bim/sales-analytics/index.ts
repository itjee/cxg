/**
 * SalesAnalytics Feature - Index
 * 영업 분석 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { SalesAnalyticsHeader } from './components/sales-analytics-header';
export { SalesAnalyticsStats } from './components/sales-analytics-stats';
export { SalesAnalyticsFilters } from './components/sales-analytics-filters';
export { SalesAnalyticsList } from './components/sales-analytics-list';
export { SalesAnalyticsPaging } from './components/sales-analytics-paging';
export { SalesAnalyticsEdit } from './components/sales-analytics-edit';

// Hooks
export {
  useSalesAnalytics,
  useSalesAnalyticsById,
  useCreateSalesAnalytics,
  useUpdateSalesAnalytics,
  useDeleteSalesAnalytics,
} from './hooks';

// Services
export { sales-analyticsService } from './services';

// Types
export type {
  SalesAnalytics,
  CreateSalesAnalyticsRequest,
  UpdateSalesAnalyticsRequest,
  SalesAnalyticsListResponse,
  SalesAnalyticsDetailResponse,
  SalesAnalyticsQueryParams,
} from './types';
