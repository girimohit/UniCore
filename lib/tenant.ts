import { prisma } from './db';
import type { NextRequest } from 'next/server';

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  status: string;
  // Included relations can be typed properly based on Prisma generated types
  institutionModules?: any[];
}

/**
 * Extracts the tenantSlug purely from a NextRequest object format.
 * Primarily useful inside Next.js Route Handlers (API).
 */
export function getTenantFromRequest(req: NextRequest): string | null {
  // Step 3: Prefer headers set by Middleware
  const headerSlug = req.headers.get('x-tenant-slug') || req.headers.get('x-tenant-id');
  if (headerSlug) return headerSlug;

  // Fallback extraction
  const hostname = req.headers.get('host') || '';
  const url = new URL(req.url);
  
  const baseDomains = ['unicore.app', 'unicore.com', 'localhost:3000', '127.0.0.1:3000'];
  const isBaseDomain = baseDomains.includes(hostname);

  let tenantSlug = null;

  if (!isBaseDomain) {
    for (const base of baseDomains) {
      if (hostname.endsWith(`.${base}`)) {
        tenantSlug = hostname.replace(`.${base}`, '');
        break;
      }
    }
    if (!tenantSlug && !hostname.includes('.')) {
      tenantSlug = hostname;
    }
  }

  if (!tenantSlug && isBaseDomain) {
    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      const reservedPaths = ['login', 'register', 'about', 'pricing', 'contact', 'api', '_next'];
      if (!reservedPaths.includes(firstSegment)) {
        tenantSlug = firstSegment;
      }
    }
  }

  return tenantSlug;
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
        institutionModules: {
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
