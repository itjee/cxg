/**
 * Shared Module - Public API
 *
 * This module contains all shared code that can be used across features:
 * - Global hooks (useTheme, useToast, etc.)
 * - Global stores (theme, auth, etc.)
 * - Common types (API, Domain, etc.)
 *
 * Usage:
 * import { useTheme, useToast } from '@/shared';
 * import type { User, Tenant } from '@/shared';
 */

// ========== Hooks ==========
export { useTheme, useToast, toast } from './hooks';

// ========== Stores ==========
export { useThemeStore } from './stores';

// ========== Types ==========
export type {
  // API
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  QueryParams,
  PaginationParams,
  // Domain
  EnvelopeResponse,
  ErrorDetail,
  PaginatedResponse,
  User,
  Tenant,
  TenantStatus,
  DashboardPanel,
  PanelType,
  GridPosition,
  MenuItem,
} from './types';
