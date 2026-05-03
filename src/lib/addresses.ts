/** Matches GET/PATCH /api/addresses response `address` objects. */
export type ApiAddress = {
  id: string;
  label: string | null;
  ghanaPost: string | null;
  community: string | null;
  locality: string | null;
  geo?: { lat: number; lng: number; accuracyM?: number };
  updatedAt: string;
};

export type DeliveryPayload = {
  ghanaPost?: string;
  community?: string;
  locality?: string;
  geo?: { lat: number; lng: number; accuracyM?: number };
};

export function apiAddressToDeliveryPayload(a: ApiAddress): DeliveryPayload {
  const out: DeliveryPayload = {};
  if (a.ghanaPost?.trim()) out.ghanaPost = a.ghanaPost.trim();
  if (a.community?.trim()) out.community = a.community.trim();
  if (a.locality?.trim()) out.locality = a.locality.trim();
  if (a.geo) {
    out.geo = { lat: a.geo.lat, lng: a.geo.lng };
    if (a.geo.accuracyM != null && Number.isFinite(a.geo.accuracyM)) {
      out.geo.accuracyM = Math.round(a.geo.accuracyM);
    }
  }
  return out;
}

export function deliveryPayloadHasContent(d: DeliveryPayload | Record<string, unknown>): boolean {
  const x = d as DeliveryPayload;
  return Boolean(x.ghanaPost || x.community || x.locality || x.geo);
}

export function formatAddressOption(a: ApiAddress): string {
  if (a.label?.trim()) return a.label.trim();
  const parts = [a.community, a.ghanaPost, a.locality].filter((x) => x?.trim());
  if (parts.length) return parts.join(" · ");
  if (a.geo) return `GPS · ${a.geo.lat.toFixed(4)}, ${a.geo.lng.toFixed(4)}`;
  return "Saved location";
}
