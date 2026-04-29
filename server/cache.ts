/**
 * Simple in-memory cache.
 * Does not require Redis — sufficient for single-process applications.
 * On Netlify Functions, since each invocation is a new process,
 * the cache will be empty on cold start; this is normal and expected behavior.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/** Read from cache. Returns null if expired. */
export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

/** Write to cache. ttlMs = lifetime in milliseconds. */
export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/** Delete a specific key (when data is updated). */
export function cacheInvalidate(key: string): void {
  store.delete(key);
}

/** Clear the entire cache. */
export function cacheClear(): void {
  store.clear();
}

// Cache key constants
export const CACHE_KEYS = {
  CATALOG: "catalog",
  SETTINGS: "settings",
} as const;

// Default TTL: 5 minutes (data rarely changes)
export const DEFAULT_TTL = 5 * 60 * 1000;
