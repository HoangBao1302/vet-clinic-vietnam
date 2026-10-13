import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRE = '7d';

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET || 'dev-only-jwt-secret', {
    expiresIn: JWT_EXPIRE,
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET || 'dev-only-jwt-secret') as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Generate reset password token
export function generateResetToken(): { token: string; hashedToken: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
}

// Hash reset token for comparison
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

