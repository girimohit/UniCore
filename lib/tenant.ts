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
  // Step 1: Prefer headers set by Middleware (proxy.ts)
  const headerSlug = req.headers.get('x-tenant-slug') || req.headers.get('x-tenant-id');
  if (headerSlug) return headerSlug;

  // Step 2: Fallback to hostname extraction in case middleware hasn't set the header
  const hostname = req.headers.get('host') || '';
  const baseDomains = ['unicore.app', 'unicore.com', 'localhost:3000', '127.0.0.1:3000'];
  
  if (!baseDomains.includes(hostname)) {
    const parts = hostname.split('.');
    
    // For local dev like du.localhost:3000
    if ((hostname.includes('localhost') || hostname.includes('127.0.0.1')) && parts.length >= 2) {
      return parts[0];
    } 
    // For prod like du.unicore.com
    else if (parts.length >= 3) {
      return parts[0];
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
