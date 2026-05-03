function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Public base URL of this web app (e-mail links, sharing, redirects).
 * Production default matches the Render deployment; override with `VITE_SITE_URL`.
 */
export function resolveSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);
  if (import.meta.env.PROD) return "https://believechops.onrender.com";
  return "http://localhost:5173";
}

export const SITE_URL = resolveSiteUrl();
