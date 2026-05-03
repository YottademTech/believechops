export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type ApiUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function apiFetch(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<Response> {
  const { token, headers: incomingHeaders, ...rest } = options;
  const headers = new Headers(incomingHeaders);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const body = rest.body;
  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_BASE}${path}`, { ...rest, headers });
}
