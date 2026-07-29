type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<String, Bucket>();

const CAPACITY = 5;
const REFILL_PER_SEC = 1;

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, lastRefill: now };

  const elapseSec = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapseSec * REFILL_PER_SEC);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return true;
  }

  buckets.set(key, bucket);
  return false;
};
