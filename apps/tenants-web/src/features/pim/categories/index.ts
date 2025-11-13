/**
 * Categories Feature - Index
 * 카테고리 관리 기능의 공개 API
 */

// Hooks
export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './hooks/use-categories';

// Services
export { categoryService } from './services/categories.service';

// Types
export type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
  CategoryQueryParams,
  EnvelopeResponse,
} from './categories.types';
