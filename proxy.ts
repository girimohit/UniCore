import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes can handle context directly)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Allowed base domains
  const baseDomains = ['unicore.app', 'unicore.com', 'localhost:3000', '127.0.0.1:3000'];
  const isBaseDomain = baseDomains.includes(hostname);
  
  let tenantSlug = null;

  // STEP 1: Extract tenant from path segment (Prioritized)
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    // Do not treat global pages as a tenant
    const reservedPaths = ['login', 'register', 'about', 'pricing', 'contact', 'features'];
    if (!reservedPaths.includes(firstSegment)) {
      tenantSlug = firstSegment;
    }
  }

  // STEP 2: Fallback to Subdomain (if requested, but user said "dont follow the subdomain thing")
  // For now, we only support path-based as requested.
  // If we ever need subdomain support again, we can add it here.

  if (tenantSlug) {
    // Attach tenant info to request headers for downstream consumption
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantSlug);
    response.headers.set('x-tenant-slug', tenantSlug);
    
    return response;
  }

  // Bypass for root / www sites
  return NextResponse.next();
}
