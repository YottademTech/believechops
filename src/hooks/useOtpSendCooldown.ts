import { useCallback, useEffect, useState } from "react";

/** Client-side guard so users cannot spam “Send code” between API cooldowns. */
export function useOtpSendCooldown(defaultSeconds = 60) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const startCooldown = useCallback((seconds = defaultSeconds) => {
    setCooldownSeconds(Math.max(1, Math.ceil(seconds)));
  }, [defaultSeconds]);

  return {
    cooldownSeconds,
    canSend: cooldownSeconds === 0,
    startCooldown,
  };
}

export function getRetryAfterSeconds(err: unknown): number | undefined {
  if (err && typeof err === "object" && "retryAfterSeconds" in err) {
    const n = (err as { retryAfterSeconds?: unknown }).retryAfterSeconds;
    if (typeof n === "number" && Number.isFinite(n) && n > 0) return Math.ceil(n);
  }
  return undefined;
}
