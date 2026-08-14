import { type SeoDocument, resolveSeoDocument } from "./seo";

const PRERENDER_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { document: SeoDocument; expiresAt: number }>();

export function getPrerenderCacheKey(originalUrl: string): string {
  const pathname = originalUrl.split("?")[0] || "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * Caches only public, route-level SEO documents. It never stores request bodies,
 * cookies, query values or authentication state, so shared output stays safe.
 */
export async function getPrerenderedSeoDocument(originalUrl: string): Promise<SeoDocument> {
  const key = getPrerenderCacheKey(originalUrl);
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.document;

  const document = await resolveSeoDocument(key);
  cache.set(key, { document, expiresAt: Date.now() + PRERENDER_TTL_MS });
  return document;
}

export function clearPrerenderCache(): void {
  cache.clear();
}
