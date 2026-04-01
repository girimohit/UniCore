import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/env'


const JWT_SECRET = env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  institutionId: string;
  institutionSlug: string;
  role: string;
}

/**
 * Creates a JWT token valid for 24 hours.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verifies a JWT token and returns the payload.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a stateless reset token valid for 24 hours.
 * Uses a secret unique to the user's current password hash.
 */
export function signResetToken(userId: string, currentHash: string): string {
  const secret = JWT_SECRET + currentHash;
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}

/**
 * Verifies a reset token against a specific user's hash.
 */
export function verifyResetToken(token: string, currentHash: string): { userId: string } | null {
  try {
    const secret = JWT_SECRET + currentHash;
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    return null;
  }
}

/**
 * Hashes a plaintext password asynchronously.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password with a hashed password.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
