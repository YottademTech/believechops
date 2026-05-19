/** Business WhatsApp (E.164 without +) — wa.me link target. */
export const BUSINESS_WHATSAPP = "233549729309";

export const BUSINESS_PHONE_DISPLAY = "054 972 9309";

/** Shown on Contact page, footer, and map links. */
export const BUSINESS_ADDRESS_LINES = [
  "Believe Chops",
  "Osuown Street, New Fadama Rd, Accra",
] as const;

export const BUSINESS_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/BelieveChops/@5.5985107,-0.2558028,17z";

export function whatsAppUrl(text: string): string {
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
