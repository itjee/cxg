/**
 * @file menus-api.ts
 * @description API client for menu management
 */

import { api } from '@/lib/api';
import type { Menu, MenuTreeNode } from '@/features/sys/menus/types';

export interface MenuTreeResponse {
  items: MenuTreeNode[];
  total: number;
}

/**
 * Fetch menu tree from API
 */
export async function fetchMenuTree(
  isActive?: boolean,
  isVisible?: boolean
): Promise<MenuTreeResponse> {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('is_active', String(isActive));
  if (isVisible !== undefined) params.append('is_visible', String(isVisible));

  const response = await api.get<MenuTreeResponse>(
    `/api/v1/sys/menus/tree?${params.toString()}`
  );
  
  return response.data;
}

/**
 * Fetch single menu by ID
 */
export async function fetchMenu(id: string): Promise<Menu> {
  const response = await api.get<Menu>(`/api/v1/sys/menus/${id}`);
  return response.data;
}
