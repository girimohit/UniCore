import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

/**
 * PATH-BASED MULTI-TENANCY MIDDLEWARE
 * This middleware ensures that the institution context (tenant) is correctly 
 * handled via the URL path (e.g. /du/login).
 */
export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Split path to extract tenant from /[tenant]/...
  const pathParts = pathname.split('/').filter(Boolean);
  
  // Reserved root paths that are NOT tenants
  const reservedRootPaths = [
    'login', 'register', 'demo', 'docs', 'about', 'contact', 'admin', 'faculty', 'student'
  ];

  let tenantSlug: string | null = null;

  // Look for tenant in first path segment if it's not a reserved root path
  if (pathParts.length > 0 && !reservedRootPaths.includes(pathParts[0].toLowerCase())) {
    tenantSlug = pathParts[0];
  }

  if (tenantSlug) {
    // Optionally attach tenant info to headers for easier access in server components/actions
    const response = NextResponse.next();
    response.headers.set('x-tenant-slug', tenantSlug);
    response.headers.set('x-tenant-id', tenantSlug);
    return response;
  }

  // No tenant in path (e.g. landing page /) — proceed as normal
  return NextResponse.next();
}
