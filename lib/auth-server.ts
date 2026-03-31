"use server"

import { cookies } from 'next/headers';
import { verifyToken, JwtPayload } from '@/lib/auth';

/**
 * Retrieves the current user session from the auth_token cookie.
 * Designed for use in Server Components and Server Actions.
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}