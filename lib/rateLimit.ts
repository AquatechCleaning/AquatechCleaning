/**
 * Lightweight in-memory rate limiter for Next.js API routes.
 * Works on Vercel — resets per cold start (good enough for abuse prevention
 * on low-traffic public forms without a Redis dependency).
 *
 * For high-traffic production, swap for Upstash Redis rate limiting.
 */

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(
  ip: string,
  options: { limit: number; windowMs: number } = { limit: 5, windowMs: 60_000 }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1 };
  }

  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: options.limit - entry.count };
}

/** Extract real IP from Vercel/Next.js request headers */
export function getIP(request: Request): string {
  const headers = new Headers((request as any).headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
