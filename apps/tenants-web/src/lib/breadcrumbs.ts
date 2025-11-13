'use client';

/**
 * Breadcrumb configuration for tenant workspace
 */

import { menuGroups } from '@/constants/menu-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DynamicBreadcrumbData {
  [key: string]: string;
}

// Build route labels from menu configuration dynamically
function buildRouteLabels(): Record<string, string> {
  const labels: Record<string, string> = {
    "/overview": "대시보드",
  };

  menuGroups.forEach(group => {
    group.items.forEach(item => {
      labels[item.href] = item.name;
    });
  });

  return labels;
}

// Build group labels from menu configuration (menu category names)
function buildGroupLabels(): Record<string, string> {
  const labels: Record<string, string> = {};

  menuGroups.forEach(group => {
    const parts = group.items[0]?.href.split('/').filter(Boolean);
    if (parts && parts.length > 0) {
      labels[parts[0]] = group.name;
    }
  });

  return labels;
}

const routeLabels = buildRouteLabels();
const categoryLabels = buildGroupLabels();

/**
 * Generate breadcrumbs from pathname with optional dynamic data
 */
export function generateBreadcrumbs(pathname: string, dynamicData?: DynamicBreadcrumbData): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "홈", href: "/overview" },
  ];

  // Handle root path
  if (pathname === "/" || pathname === "/overview") {
    breadcrumbs.push({ label: "대시보드" });
    return breadcrumbs;
  }

  // Get exact match first
  if (routeLabels[pathname]) {
    const parts = pathname.split("/").filter(Boolean);
    
    // Add category if exists
    if (parts.length >= 2) {
      const category = parts[0];
      if (categoryLabels[category]) {
        breadcrumbs.push({
          label: categoryLabels[category],
          href: undefined, // Category is not clickable
        });
      }
    }

    // Add current page
    breadcrumbs.push({
      label: routeLabels[pathname],
    });

    return breadcrumbs;
  }

  // Handle dynamic routes (e.g., /bim/partner-portal/123)
  const parts = pathname.split("/").filter(Boolean);
  let currentPath = "";

  // Check if this is a portal route (sales-portal, partner-portal, product-portal)
  const isPortalRoute = parts.some(part =>
    part.includes('portal')
  );

  // For portal routes, find the portal item label by matching the path without the ID
  let portalLabel: string | null = null;
  if (isPortalRoute && parts.length >= 2) {
    // Build path without the ID: /bim/partner-portal
    const pathWithoutId = "/" + parts.slice(0, 2).join("/");
    portalLabel = routeLabels[pathWithoutId] || null;
  }

  for (let i = 0; i < parts.length; i++) {
    currentPath += "/" + parts[i];

    // Skip dynamic ID for portal routes
    const isLastSegment = i === parts.length - 1;
    const isIdSegment = isLastSegment && isPortalRoute && parts[i].match(/^\d+$/);

    if (isIdSegment) {
      // Skip adding the ID breadcrumb for portal routes
      continue;
    }

    // Check if we have a label for this path
    if (routeLabels[currentPath]) {
      breadcrumbs.push({
        label: routeLabels[currentPath],
        href: isLastSegment ? undefined : currentPath,
      });

      // For portal routes, also add the category/group label before the portal item
      if (isPortalRoute && i === 1 && categoryLabels[parts[0]]) {
        // Insert the category at the correct position (before this portal item)
        const categoryLabel = categoryLabels[parts[0]];
        const portalItem = breadcrumbs.pop(); // Remove the portal item we just added
        breadcrumbs.push({
          label: categoryLabel,
          href: undefined,
        });
        if (portalItem) {
          breadcrumbs.push(portalItem); // Re-add the portal item after the category
        }
      }
    } else if (i === 0 && categoryLabels[parts[i]]) {
      // Add category label
      breadcrumbs.push({
        label: categoryLabels[parts[i]],
        href: undefined,
      });
    } else if (!isPortalRoute && isLastSegment) {
      // Last segment without a label - check if it's a dynamic ID (non-portal route)
      const id = parts[i];
      const label = dynamicData?.[id] || id;
      breadcrumbs.push({
        label,
      });
    }
  }

  return breadcrumbs;
}
