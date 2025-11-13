/**
 * BusinessDocuments Feature - Index
 * 증빙서류 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { BusinessDocumentsHeader } from './components/business-documents-header';
export { BusinessDocumentsStats } from './components/business-documents-stats';
export { BusinessDocumentsFilters } from './components/business-documents-filters';
export { BusinessDocumentsList } from './components/business-documents-list';
export { BusinessDocumentsPaging } from './components/business-documents-paging';
export { BusinessDocumentsEdit } from './components/business-documents-edit';

// Hooks
export {
  useBusinessDocuments,
  useBusinessDocumentsById,
  useCreateBusinessDocuments,
  useUpdateBusinessDocuments,
  useDeleteBusinessDocuments,
} from './hooks';

// Services
export { business-documentsService } from './services';

// Types
export type {
  BusinessDocuments,
  CreateBusinessDocumentsRequest,
  UpdateBusinessDocumentsRequest,
  BusinessDocumentsListResponse,
  BusinessDocumentsDetailResponse,
  BusinessDocumentsQueryParams,
} from './types';
