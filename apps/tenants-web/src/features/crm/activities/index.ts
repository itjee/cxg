/**
 * Activities Feature - Index
 * 활동 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { ActivitiesHeader } from './components/activities-header';
export { ActivitiesStats } from './components/activities-stats';
export { ActivitiesFilters } from './components/activities-filters';
export { ActivitiesTable } from './components/activities-table';
export { ActivitiesPaging } from './components/activities-paging';
export { ActivitiesEdit } from './components/activities-edit';

// Hooks
export {
  useActivities,
  useActivity,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from './hooks';

// Services
export { activityService } from './services';

// Types
export type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityListResponse,
  ActivityDetailResponse,
  ActivityQueryParams,
} from './types';
