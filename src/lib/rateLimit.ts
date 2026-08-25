import "server-only";

/**
 * Rate limiting в памяти процесса — лучше, чем ничего, но НЕ защита уровня
 * продакшена: на serverless/Vercel у каждого холодного старта своя память,
 * и лимит не разделяется между инстансами. Для реального продакшена нужен
 * внешний store (Upstash Redis и т.п.) — здесь это осознанно отложено,
 * см. итоговый security-аудит.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export function clientIpFrom(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
