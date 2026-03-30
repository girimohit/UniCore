import { prisma } from './db';
import type { NextRequest } from 'next/server';

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  status: string;
  // Included relations can be typed properly based on Prisma generated types
  moduleSubscriptions?: any[];
}

/**
 * Extracts the tenantSlug purely from a NextRequest object format.
 * Primarily useful inside Next.js Route Handlers (API).
 */
export function getTenantFromRequest(req: NextRequest): string | null {
  // Step 1: Prefer headers set by Middleware
  const headerSlug = req.headers.get('x-tenant-slug') || req.headers.get('x-tenant-id');
  if (headerSlug) return headerSlug;

  // Step 2: Attempt path-based extraction from URL pathname (for page requests)
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const reservedRootPaths = [
    'api', 'login', 'register', 'demo', 'docs', 'about', 'contact', 'admin', 'faculty', 'student'
  ];

  if (pathParts.length > 0 && !reservedRootPaths.includes(pathParts[0].toLowerCase())) {
    return pathParts[0];
  }

  // Step 3: Fallback to Referer header for API requests from the frontend
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererPathParts = refererUrl.pathname.split('/').filter(Boolean);
      if (refererPathParts.length > 0 && !reservedRootPaths.includes(refererPathParts[0].toLowerCase())) {
        return refererPathParts[0];
      }
    } catch (e) {
      // Ignore invalid referer URLs
    }
  }

  // Step 4: Legacy hostname/subdomain extraction
  const hostname = req.headers.get('host') || '';
  const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000';
  const baseDomains = [baseDomain, 'localhost:3000', '127.0.0.1:3000'];
  
  if (!baseDomains.includes(hostname)) {
    if (hostname.endsWith(baseDomain)) {
       return hostname.replace(`.${baseDomain}`, '');
    } else {
       const parts = hostname.split('.');
       if (parts.length >= 2) return parts[0];
    }
  }

  return null;
}

/**
 * Database lookup to resolve and return the robust tenant context.
 * Performs lookup using tenantSlug and ensures the institution is active.
 */
export async function getTenantContext(tenantSlug: string | null): Promise<TenantContext | null> {
  // Handle invalid slug / missing tenant
  if (!tenantSlug || tenantSlug.trim() === '') {
    throw new Error(`Tenant_Invalid: Invalid or missing tenant slug.`);
  }

  try {
    // STEP 2: Query the database
    const institution = await prisma.institution.findUnique({
      where: { slug: tenantSlug },
      include: {
        moduleSubscriptions: {
          include: {
            module: true
          }
        }
      }
    });

    // STEP 4: Handle tenant not found
    if (!institution) {
      throw new Error(`Tenant_NotFound: No institution found for slug '${tenantSlug}'.`);
    }

    // STEP 4: Handle inactive institution
    if (institution.status !== 'ACTIVE') {
      throw new Error(`Tenant_Inactive: The institution '${institution.name}' is currently inactive.`);
    }

    return institution;
  } catch (error: any) {
    if (error.message.includes('Tenant_')) {
      throw error; // Re-throw known validation errors
    }
    console.error('Error fetching tenant context from database:', error);
    return null;
  }
}
