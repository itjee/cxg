/**
 * Shared Module - Public API
 *
 * This module contains all shared code that can be used across features:
 * - Global hooks (useTheme, useToast, etc.)
 * - Global stores (theme, auth, etc.)
 * - Common types (API, Domain, etc.)
 *
 * Usage:
 * import { useAuthStore } from '@/shared';
 * import type { User, Role } from '@/shared';
 */

// ========== Hooks ==========
export * from './hooks';

// ========== Stores ==========
export { useAuthStore } from './stores';

// ========== Types ==========
export type { User, UserCreateInput, UserUpdateInput, Role } from './types';
