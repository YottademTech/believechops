import type { ApiUser } from "@/lib/api";

export function getUserInitials(user: ApiUser | null): string {
  if (!user) return "?";
  const name = user.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0]![0];
      const b = parts[parts.length - 1]![0];
      return `${a}${b}`.toUpperCase();
    }
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  if (user.phone) {
    return user.phone.replace(/\D/g, "").slice(-2) || "BC";
  }
  return "BC";
}

export function formatUserPhone(user: ApiUser): string {
  if (user.phone) return user.phone;
  return "No phone on file";
}
