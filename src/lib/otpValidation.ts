/** Matches API email validation (Zod `.email()`). */
const EMAIL_RE =
  /^(?:[a-zA-Z0-9_'^&\/+{}=~!#$%*?`|.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

/** Matches API `normalizeE164Phone` — leading +, 8–16 digits total. */
const E164_RE = /^\+\d{8,16}$/;

export function normalizeEmailInput(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidSignInEmail(email: string): boolean {
  const normalized = normalizeEmailInput(email);
  return normalized.length <= 254 && EMAIL_RE.test(normalized);
}

export function normalizePhoneInput(phone: string): string {
  return phone.trim().replace(/[\s-]/g, "");
}

export function isValidSignInPhone(phone: string): boolean {
  return E164_RE.test(normalizePhoneInput(phone));
}

export function signInContactError(channel: "EMAIL" | "SMS", value: string): string | null {
  if (channel === "EMAIL") {
    if (!value.trim()) return "Enter your email address.";
    if (!isValidSignInEmail(value)) return "Enter a valid email address.";
    return null;
  }
  if (!value.trim()) return "Enter your phone number.";
  if (!isValidSignInPhone(value)) {
    return "Use international format with country code, e.g. +233551234567.";
  }
  return null;
}
