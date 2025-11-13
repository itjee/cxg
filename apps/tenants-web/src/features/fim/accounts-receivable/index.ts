/**
 * AccountsReceivable Feature - Index
 * 매출채권 관리 기능의 공개 API
 */

// Components - Standard Structure (All Plural)
export { AccountsReceivableHeader } from './components/accounts-receivable-header';
export { AccountsReceivableStats } from './components/accounts-receivable-stats';
export { AccountsReceivableFilters } from './components/accounts-receivable-filters';
export { AccountsReceivableList } from './components/accounts-receivable-list';
export { AccountsReceivablePaging } from './components/accounts-receivable-paging';
export { AccountsReceivableEdit } from './components/accounts-receivable-edit';

// Hooks
export {
  useAccountsReceivable,
  useAccountsReceivableById,
  useCreateAccountsReceivable,
  useUpdateAccountsReceivable,
  useDeleteAccountsReceivable,
} from './hooks';

// Services
export { accounts-receivableService } from './services';

// Types
export type {
  AccountsReceivable,
  CreateAccountsReceivableRequest,
  UpdateAccountsReceivableRequest,
  AccountsReceivableListResponse,
  AccountsReceivableDetailResponse,
  AccountsReceivableQueryParams,
} from './types';
