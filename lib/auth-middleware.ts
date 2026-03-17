import { NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from '@/lib/auth';
import { getTenantFromRequest } from '@/lib/tenant';
import type { NextRequest } from 'next/server';

type AuthenticatedHandler = (
  req: NextRequest,
  context: any,
  user: JwtPayload
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware wrapper for API Routes to enforce Authentication, 
 * Tenant Validation, and Role-Based Access Control.
 */
export function withAuth(
  allowedRoles: string[] = [],
  handler: AuthenticatedHandler
) {
  return async (req: NextRequest, context: any) => {
    try {
      // 1. Check for token in cookies or Authorization header
      let token = req.cookies.get('auth_token')?.value;
      if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
      }

      // 2. Verify token signature and payload
      const decodedUser = verifyToken(token);
      if (!decodedUser) {
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
      }

      // 3. Tenant Validation - Ensure token tenant matches the request subdomain
      const requestTenant = getTenantFromRequest(req);

      // If the request has a subdomain context, enforce tenant isolation
      if (requestTenant && decodedUser.tenant_id !== requestTenant) {
        return NextResponse.json({ error: 'Forbidden: Cross-tenant access denied' }, { status: 403 });
      }

      // 4. Role Validation
      if (allowedRoles.length > 0 && !allowedRoles.includes(decodedUser.role)) {
        return NextResponse.json({
          error: `Forbidden: Insufficient permissions. Required one of: ${allowedRoles.join(', ')}`
        }, { status: 403 });
      }

      // Execute original handler with the injected user payload
      return await handler(req, context, decodedUser);

    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
