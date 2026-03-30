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

  // Define base domains where we don't extract subdomains (landing page)
  const baseDomains = ['unicore.app', 'unicore.com', 'localhost:3000', '127.0.0.1:3000'];
  const isBaseDomain = baseDomains.some(domain => hostname === domain);
  
  let tenantSlug: string | null = null;

  if (!isBaseDomain) {
    // Subdomain extraction logic
    const parts = hostname.split('.');
    
    // Handle localhost and production cases separately
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      // e.g., du.localhost:3000 -> ["du", "localhost:3000"]
      if (parts.length >= 2) {
        tenantSlug = parts[0];
      }
    } else {
      // e.g., du.unicore.com -> ["du", "unicore", "com"]
      if (parts.length >= 3) {
        tenantSlug = parts[0];
      }
    }
  }

  // Reserved subdomains that shouldn't be treated as tenants
  const reservedSubdomains = ['www', 'app', 'admin', 'api', 'mail', 'static'];
  if (tenantSlug && reservedSubdomains.includes(tenantSlug.toLowerCase())) {
    tenantSlug = null;
  }

  if (tenantSlug) {
    // Prevent double nesting if the path already starts with the tenant slug
    // (e.g. if someone manually types du.domain.com/du/...)
    if (!url.pathname.startsWith(`/${tenantSlug}`)) {
      url.pathname = `/${tenantSlug}${url.pathname}`;
    }
    
    // Rewrite internally so Next.js matches the /[tenant]/... folder structure
    const response = NextResponse.rewrite(url);
    
    // Attach tenant info to headers for downstream consumption (Server Components / API)
    response.headers.set('x-tenant-id', tenantSlug);
    response.headers.set('x-tenant-slug', tenantSlug);
    
    return response;
  }

  // Bypass for root / www sites (loads the main landing page from app/page.tsx)
  return NextResponse.next();
}
