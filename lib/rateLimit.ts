// Simple in-memory rate limiter
// For production, consider using Redis-based rate limiting

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { windowMs, max, message } = options;
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = store[key];

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    store[key] = entry;
  }

  // Increment count
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      message: message || `Quá nhiều requests. Vui lòng thử lại sau ${Math.ceil((entry.resetTime - now) / 1000)} giây.`,
    };
  }

  // Cleanup old entries periodically (every 1000 calls)
  if (Math.random() < 0.001) {
    cleanupExpiredEntries();
  }

  return {
    allowed: true,
    remaining: max - entry.count,
    resetTime: entry.resetTime,
  };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

// Helper to get client IP from Next.js request
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work in serverless, but good for local dev)
  return 'unknown';
}

// Pre-configured rate limiters for common use cases
export const registerLimiter = (ip: string) =>
  rateLimit(ip, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 registration attempts per 15 minutes
    message: 'Quá nhiều lần đăng ký. Vui lòng thử lại sau 15 phút.',
  });

export const loginLimiter = (ip: string) =>
  rateLimit(ip, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per 15 minutes
    message: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút.',
  });

export const downloadLimiter = (userId: string) =>
  rateLimit(userId, {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 downloads per hour
    message: 'Quá nhiều lần download. Vui lòng thử lại sau 1 giờ.',
  });

export const apiLimiter = (ip: string) =>
  rateLimit(ip, {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Quá nhiều requests. Vui lòng thử lại sau.',
  });

