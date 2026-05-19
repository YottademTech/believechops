import type { DeliveryPayload } from "@/lib/addresses";
import type { MenuItem } from "@/data/menu";
import { whatsAppUrl } from "@/lib/contact";

export type OrderLineForMessage = {
  item: MenuItem;
  quantity: number;
};

export type BuildWhatsAppOrderParams = {
  orderId: string;
  customerLabel: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  lines: OrderLineForMessage[];
  delivery: DeliveryPayload;
};

function formatDelivery(d: DeliveryPayload): string {
  const parts: string[] = [];
  if (d.ghanaPost?.trim()) parts.push(`Ghana Post: ${d.ghanaPost.trim()}`);
  if (d.community?.trim()) parts.push(`Area: ${d.community.trim()}`);
  if (d.locality?.trim()) parts.push(`Directions: ${d.locality.trim()}`);
  if (d.geo) {
    const acc =
      d.geo.accuracyM != null ? ` (±${Math.round(d.geo.accuracyM)}m)` : "";
    parts.push(`GPS: ${d.geo.lat.toFixed(5)}, ${d.geo.lng.toFixed(5)}${acc}`);
    parts.push(`Maps: https://www.google.com/maps?q=${d.geo.lat},${d.geo.lng}`);
  }
  return parts.length ? parts.join("\n") : "—";
}

export function buildWhatsAppOrderMessage(params: BuildWhatsAppOrderParams): string {
  const items = params.lines
    .map(({ item, quantity }) => `• ${item.name} × ${quantity}`)
    .join("\n");

  const contact = [params.customerEmail, params.customerPhone].filter(Boolean).join(" · ");

  return [
    "Hello Believe Chops! I'd like to place an order from the website.",
    "",
    `Order ref: ${params.orderId}`,
    `Name: ${params.customerLabel}`,
    contact ? `Contact: ${contact}` : "",
    "",
    "Items:",
    items || "—",
    "",
    "Delivery:",
    formatDelivery(params.delivery),
    "",
    "Please confirm availability, price, and delivery time. Thank you!",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildWhatsAppOrderUrl(params: BuildWhatsAppOrderParams): string {
  return whatsAppUrl(buildWhatsAppOrderMessage(params));
}
