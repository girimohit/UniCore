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

  // Use BASE_DOMAIN from environment (e.g., "localhost:3000" or "unicore-erp.tech")
  const baseDomain = process.env.BASE_DOMAIN || 'localhost:3000';
  
  // Never extract tenant from Vercel preview URLs (*.vercel.app)
  // or any IP/localhost variant
  const isVercelDomain = hostname.endsWith('.vercel.app') || hostname === 'vercel.app';
  if (isVercelDomain) return NextResponse.next();

  // Define base sites where we don't extract subdomains
  const baseDomains = [baseDomain, 'localhost:3000', '127.0.0.1:3000'];
  const isBaseDomain = baseDomains.some(domain => hostname === domain || hostname.endsWith(`:${domain}`));
  
  let tenantSlug: string | null = null;

  if (!isBaseDomain) {
    if (hostname.endsWith(baseDomain)) {
       tenantSlug = hostname.replace(`.${baseDomain}`, '');
    } else {
       const parts = hostname.split('.');
       if (parts.length >= 2) tenantSlug = parts[0];
    }
  }

  // Reserved subdomains
  const reservedSubdomains = ['www', 'app', 'admin', 'api', 'mail', 'static', 'test'];
  if (tenantSlug && reservedSubdomains.includes(tenantSlug.toLowerCase())) {
    tenantSlug = null;
  }

  if (tenantSlug) {
    /**
     * INFINITE LOOP PREVENTION:
     * If the internal pathname already starts with /${tenantSlug},
     * it means we've already done the rewrite in a previous pass of this middleware.
     * We should let it proceed to the page handler.
     */
    if (url.pathname.startsWith(`/${tenantSlug}`)) {
      return NextResponse.next();
    }

    // Map du.domain.com/path to domain.com/du/path
    url.pathname = `/${tenantSlug}${url.pathname}`;
    
    // Rewrite internally so Next.js matches the folder structure
    const response = NextResponse.rewrite(url);
    
    // Attach tenant info to headers for downstream consumption
    response.headers.set('x-tenant-slug', tenantSlug);
    response.headers.set('x-tenant-id', tenantSlug);
    
    return response;
  }

  // Bypass for root sites
  return NextResponse.next();
}
