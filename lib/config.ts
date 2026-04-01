import { env } from '@/lib/env'
/**
 * Centralized application configuration.
 * Avoid hardcoding URLs and environment-specific settings throughout the codebase.
 */
export const APP_CONFIG = {
  // Use NEXT_PUBLIC_ prefix for client-side accessibility if needed
  baseUrl: env.NEXT_PUBLIC_APP_URL || 'unicore-ten.vercel.app',

  // Flag to control whether we prioritize path-based vs subdomain-based routing
  routingStrategy: 'path' as 'path' | 'subdomain',
};

/**
 * Returns the fully qualified URL for a given tenant path.
 */
export function getTenantUrl(tenantSlug: string, path: string = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (APP_CONFIG.routingStrategy === 'subdomain') {
    const url = new URL(APP_CONFIG.baseUrl);
    return `${url.protocol}//${tenantSlug}.${url.host}${normalizedPath}`;
  }

  return `${APP_CONFIG.baseUrl}/${tenantSlug}${normalizedPath}`;
}
