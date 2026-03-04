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
  let isPathBased = false;

  // STEP 1: Extract Subdomain if present
  if (!isBaseDomain) {
    for (const base of baseDomains) {
      if (hostname.endsWith(`.${base}`)) {
        tenantSlug = hostname.replace(`.${base}`, '');
        break;
      }
    }
    // Fallback for custom local hostnames without clear boundaries
    if (!tenantSlug && !hostname.includes('.')) {
      tenantSlug = hostname;
    }
  }

  // STEP 1: Otherwise extract first path segment
  if (!tenantSlug && isBaseDomain) {
    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      // Do not treat global pages as a tenant
      const reservedPaths = ['login', 'register', 'about', 'pricing', 'contact', 'features'];
      if (!reservedPaths.includes(firstSegment)) {
        tenantSlug = firstSegment;
        isPathBased = true;
      }
    }
  }

  if (tenantSlug) {
    if (!isPathBased) {
      // Rewrite path to trigger App Router's dynamic `[tenant]` segment route if using a subdomain
      url.pathname = `/${tenantSlug}${url.pathname}`;
    }
    
    // If it's already path-based, Next.js natively routes it to `[tenant]`, we just let it pass
    const response = isPathBased ? NextResponse.next() : NextResponse.rewrite(url);
    
    // STEP 3: Attach tenant info to request headers
    response.headers.set('x-tenant-id', tenantSlug);
    response.headers.set('x-tenant-slug', tenantSlug);
    
    return response;
  }

  // Bypass for root / www sites
  return NextResponse.next();
}
