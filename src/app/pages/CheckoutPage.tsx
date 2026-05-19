import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import {
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import {
  apiAddressToDeliveryPayload,
  deliveryPayloadHasContent,
  formatAddressOption,
  type ApiAddress,
} from "@/lib/addresses";
import { buildWhatsAppOrderUrl } from "@/lib/whatsappOrder";
import { useOtpSendCooldown, getRetryAfterSeconds } from "@/hooks/useOtpSendCooldown";
import {
  isValidSignInEmail,
  isValidSignInPhone,
  normalizeEmailInput,
  normalizePhoneInput,
  signInContactError,
} from "@/lib/otpValidation";
import { OtpInputBoxes } from "@/app/components/OtpInputBoxes";

type OtpChannel = "EMAIL" | "SMS";

export function CheckoutPage() {
  const { token, user, loading: authLoading, requestOtp, verifyOtp, logout } = useAuth();
  const { lineDetails, itemCount, cartReady, setQuantity, removeItem, clear } = useCart();

  const [otpChannel, setOtpChannel] = useState<OtpChannel>("EMAIL");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "sent">("idle");
  const [lastSentContactKey, setLastSentContactKey] = useState("");
  const { cooldownSeconds, canSend, startCooldown } = useOtpSendCooldown(60);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);

  const [ghanaPost, setGhanaPost] = useState("");
  const [community, setCommunity] = useState("");
  const [locality, setLocality] = useState("");
  const [geo, setGeo] = useState<{
    lat: number;
    lng: number;
    accuracyM?: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<ApiAddress[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<"saved" | "new">("new");
  const [selectedSavedId, setSelectedSavedId] = useState("");

  useEffect(() => {
    if (!token) {
      setSavedAddresses([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/addresses", { token });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { addresses: ApiAddress[] };
        if (cancelled) return;
        const list = data.addresses ?? [];
        setSavedAddresses(list);
        if (list.length > 0) {
          setDeliveryMode("saved");
          setSelectedSavedId((prev) =>
            prev && list.some((a) => a.id === prev) ? prev : list[0].id,
          );
        } else {
          setDeliveryMode("new");
          setSelectedSavedId("");
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function buildManualDeliveryPayload() {
    const out: {
      ghanaPost?: string;
      community?: string;
      locality?: string;
      geo?: { lat: number; lng: number; accuracyM?: number };
    } = {};
    const gp = ghanaPost.trim();
    const com = community.trim();
    const loc = locality.trim();
    if (gp) out.ghanaPost = gp;
    if (com) out.community = com;
    if (loc) out.locality = loc;
    if (geo) {
      out.geo = { lat: geo.lat, lng: geo.lng };
      if (geo.accuracyM != null && Number.isFinite(geo.accuracyM)) {
        out.geo.accuracyM = Math.round(geo.accuracyM);
      }
    }
    return out;
  }

  function buildDeliveryPayload() {
    if (deliveryMode === "saved" && selectedSavedId) {
      const a = savedAddresses.find((x) => x.id === selectedSavedId);
      if (a) return apiAddressToDeliveryPayload(a);
    }
    return buildManualDeliveryPayload();
  }

  function hasDeliveryInfo(): boolean {
    return deliveryPayloadHasContent(buildDeliveryPayload());
  }

  function handleShareLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM:
            pos.coords.accuracy != null && Number.isFinite(pos.coords.accuracy)
              ? pos.coords.accuracy
              : undefined,
        });
        setLocating(false);
        toast.success("Location captured.");
      },
      () => {
        setLocating(false);
        toast.error("Could not read your location. Allow permission or enter your address below.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  }

  if (!authLoading && cartReady && itemCount === 0 && !submitted) {
    return <Navigate to="/menu" replace />;
  }

  const contactKey =
    otpChannel === "EMAIL"
      ? `e:${normalizeEmailInput(email)}`
      : `p:${normalizePhoneInput(phone)}`;

  const canSendToContact = canSend || (lastSentContactKey !== "" && lastSentContactKey !== contactKey);

  const contactReady =
    otpChannel === "EMAIL" ? isValidSignInEmail(email) : isValidSignInPhone(phone);

  async function handleSendCode() {
    const validationError = signInContactError(
      otpChannel,
      otpChannel === "EMAIL" ? email : phone,
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (!canSendToContact) {
      toast.error(`Please wait ${cooldownSeconds}s before requesting another code.`);
      return;
    }
    setBusy(true);
    try {
      await requestOtp({
        channel: otpChannel,
        ...(otpChannel === "EMAIL"
          ? { email: normalizeEmailInput(email) }
          : { phone: normalizePhoneInput(phone) }),
      });
      setOtpStep("sent");
      setLastSentContactKey(contactKey);
      startCooldown();
      toast.success("Check your inbox or phone for the code.");
    } catch (e) {
      const retry = getRetryAfterSeconds(e);
      if (retry) startCooldown(retry);
      toast.error(e instanceof Error ? e.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  }

  function resetSignInFlow() {
    setOtpStep("idle");
    setCode("");
    setLastSentContactKey("");
  }

  async function handleVerifyCode() {
    setBusy(true);
    try {
      await verifyOtp({
        channel: otpChannel,
        ...(otpChannel === "EMAIL"
          ? { email: normalizeEmailInput(email) }
          : { phone: normalizePhoneInput(phone) }),
        code: code.replace(/\D/g, ""),
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      toast.success("You're signed in.");
      setOtpStep("idle");
      setCode("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitViaWhatsApp() {
    if (!token || !user) return;
    if (!hasDeliveryInfo()) {
      toast.error(
        "Choose a saved address or add Ghana Post / area / locality / GPS for this order.",
      );
      return;
    }
    if (lineDetails.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setBusy(true);
    try {
      const delivery = buildDeliveryPayload();
      const res = await apiFetch("/api/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          totalAmount: 0,
          currency: "GHS",
          delivery,
          items: {
            channel: "whatsapp",
            lines: lineDetails.map((l) => ({
              id: l.item.id,
              name: l.item.name,
              kind: l.item.kind,
              quantity: l.quantity,
            })),
          },
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Order failed");
      }
      const { order } = (await res.json()) as { order: { id: string } };
      const customerLabel =
        user.name?.trim() || user.email || user.phone || "Customer";
      const url = buildWhatsAppOrderUrl({
        orderId: order.id,
        customerLabel,
        customerEmail: user.email,
        customerPhone: user.phone,
        lines: lineDetails,
        delivery,
      });
      setLastWhatsAppUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
      clear();
      setSubmitted(true);
      toast.success("Order saved — send the WhatsApp message to confirm.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (token && !cartReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-yellow-400 mx-auto" />
          <h1 className="text-3xl font-bold">Order sent</h1>
          <p className="text-gray-400 leading-relaxed">
            We saved your order and opened WhatsApp with the details. Tap send there so we can
            confirm price and delivery — thanks for choosing Believe Chops!
          </p>
          {lastWhatsAppUrl && (
            <a
              href={lastWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-8 py-3 rounded-full hover:bg-green-600"
            >
              <MessageSquare className="w-5 h-5" />
              Open WhatsApp again
            </a>
          )}
          <Link
            to="/menu"
            className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-300"
          >
            Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Checkout <span className="text-yellow-400">simple</span>
          </h1>
          <p className="text-gray-400">
            Review your items and quantities, sign in so we know who you are, then send your order on
            WhatsApp. We&apos;ll confirm price and delivery time with you there — no online payment
            for now.
          </p>
        </div>

        {token && user && (
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              Delivery location
            </h2>
            <p className="text-sm text-gray-400">
              Use an address from your profile, share live GPS, or enter details for this order only.
            </p>
            <p className="text-xs text-gray-500">
              <Link to="/profile#saved-addresses" className="text-yellow-500 hover:underline">
                Manage saved addresses
              </Link>{" "}
              on your profile.
            </p>

            <div className="flex rounded-full bg-gray-800 p-1 gap-1 max-w-md">
              <button
                type="button"
                disabled={busy || savedAddresses.length === 0}
                onClick={() => setDeliveryMode("saved")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  deliveryMode === "saved" ? "bg-yellow-400 text-black" : "text-gray-400"
                } disabled:opacity-40`}
              >
                Saved address
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeliveryMode("new")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  deliveryMode === "new" ? "bg-yellow-400 text-black" : "text-gray-400"
                }`}
              >
                New for this order
              </button>
            </div>

            {deliveryMode === "saved" && savedAddresses.length > 0 && (
              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs text-gray-500">Choose saved address</span>
                  <select
                    disabled={busy}
                    value={selectedSavedId}
                    onChange={(e) => setSelectedSavedId(e.target.value)}
                    className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white disabled:opacity-40"
                  >
                    {savedAddresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {formatAddressOption(a)}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedSavedId &&
                  (() => {
                    const sel = savedAddresses.find((a) => a.id === selectedSavedId);
                    if (!sel) return null;
                    return (
                      <div className="rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-sm text-gray-300 space-y-1">
                        {sel.label && <p className="font-medium text-white">{sel.label}</p>}
                        {sel.ghanaPost && (
                          <p>
                            <span className="text-gray-500">Ghana Post:</span> {sel.ghanaPost}
                          </p>
                        )}
                        {sel.community && (
                          <p>
                            <span className="text-gray-500">Area:</span> {sel.community}
                          </p>
                        )}
                        {sel.locality && (
                          <p>
                            <span className="text-gray-500">Details:</span> {sel.locality}
                          </p>
                        )}
                        {sel.geo && (
                          <p className="text-xs text-green-400/90 tabular-nums">
                            GPS {sel.geo.lat.toFixed(5)}, {sel.geo.lng.toFixed(5)}
                            {sel.geo.accuracyM != null
                              ? ` · ±${Math.round(sel.geo.accuracyM)} m`
                              : ""}
                          </p>
                        )}
                      </div>
                    );
                  })()}
              </div>
            )}

            {deliveryMode === "new" && (
              <>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={busy || locating}
                    onClick={handleShareLocation}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 hover:bg-gray-700 px-4 py-3 font-semibold text-sm disabled:opacity-40"
                  >
                    {locating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-yellow-400" />
                    )}
                    Share current location
                  </button>
                  {geo && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setGeo(null)}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-600 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                    >
                      Clear GPS
                    </button>
                  )}
                </div>
                {geo && (
                  <p className="text-xs text-green-400/90 tabular-nums">
                    GPS ({geo.lat.toFixed(5)}, {geo.lng.toFixed(5)}
                    {geo.accuracyM != null ? ` · ±${Math.round(geo.accuracyM)} m` : ""})
                  </p>
                )}

                <label className="block space-y-1">
                  <span className="text-xs text-gray-500">Ghana Post (digital address)</span>
                  <input
                    type="text"
                    disabled={busy}
                    className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white placeholder:text-gray-600 disabled:opacity-40"
                    value={ghanaPost}
                    onChange={(e) => setGhanaPost(e.target.value)}
                    placeholder="e.g. GA-123-4567"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-gray-500">Community / neighbourhood</span>
                  <input
                    type="text"
                    disabled={busy}
                    className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white placeholder:text-gray-600 disabled:opacity-40"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="e.g. East Legon, Dansoman"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-gray-500">
                    Locality — street, landmark, directions
                  </span>
                  <textarea
                    disabled={busy}
                    rows={3}
                    className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white placeholder:text-gray-600 resize-y min-h-[88px] disabled:opacity-40"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="House number, gate colour, nearby shop…"
                  />
                </label>
              </>
            )}

            {!hasDeliveryInfo() && (
              <p className="text-xs text-amber-400/90">
                {deliveryMode === "saved"
                  ? "Choose a saved address above, or switch to “New for this order”."
                  : "Add GPS and/or Ghana Post, community, or locality before you submit."}
              </p>
            )}
          </section>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-4 lg:col-span-7">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              Your cart ({itemCount})
            </h2>
            {lineDetails.length === 0 ? (
              <p className="text-gray-500 text-sm">Cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {lineDetails.map(({ item, quantity }) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.kind}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                        disabled={busy}
                        onClick={() => setQuantity(item.id, quantity - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums font-semibold">{quantity}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                        disabled={busy}
                        onClick={() => setQuantity(item.id, quantity + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-400 hover:underline ml-2 disabled:opacity-40"
                        disabled={busy}
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-3">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <p className="text-gray-300">
                <span className="text-2xl font-bold text-yellow-400 tabular-nums">{itemCount}</span>{" "}
                {itemCount === 1 ? "item" : "items"} in your request
              </p>
              <p className="text-sm text-gray-500 pt-2 border-t border-gray-800">
                Pricing is confirmed on WhatsApp after you send your order.
              </p>
            </section>

        {!token && (
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Sign in to continue</h2>
            <p className="text-sm text-gray-400">
              Browse the menu freely — we only ask you to verify here before placing your request.
            </p>

            <div className="flex rounded-full bg-gray-800 p-1 gap-1">
              <button
                type="button"
                disabled={otpStep === "sent"}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-40 ${
                  otpChannel === "EMAIL" ? "bg-yellow-400 text-black" : "text-gray-400"
                }`}
                onClick={() => {
                  setOtpChannel("EMAIL");
                  resetSignInFlow();
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                disabled={otpStep === "sent"}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-40 ${
                  otpChannel === "SMS" ? "bg-yellow-400 text-black" : "text-gray-400"
                }`}
                onClick={() => {
                  setOtpChannel("SMS");
                  resetSignInFlow();
                }}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
            </div>

            {otpChannel === "EMAIL" ? (
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  readOnly={otpStep === "sent"}
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white disabled:opacity-70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            ) : (
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Phone (E.164)</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  readOnly={otpStep === "sent"}
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white disabled:opacity-70"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233551234567"
                />
              </label>
            )}

            {otpStep !== "sent" ? (
              <button
                type="button"
                disabled={busy || !contactReady || !canSendToContact}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold disabled:opacity-40"
                onClick={() => void handleSendCode()}
              >
                {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send code"}
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-400 text-center">
                  {canSendToContact
                    ? "Didn't get a code? You can resend once."
                    : `Code sent. Resend available in ${cooldownSeconds}s.`}
                </p>
                <button
                  type="button"
                  disabled={busy || !canSendToContact}
                  className="w-full py-2 rounded-xl border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 disabled:opacity-40"
                  onClick={() => void handleSendCode()}
                >
                  {busy ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : canSendToContact ? (
                    "Resend code"
                  ) : (
                    `Resend in ${cooldownSeconds}s`
                  )}
                </button>
                <button
                  type="button"
                  className="w-full text-xs text-gray-500 hover:text-gray-300 underline"
                  onClick={resetSignInFlow}
                >
                  Use a different email or phone
                </button>
              </div>
            )}

            {otpStep === "sent" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <span className="text-xs text-gray-500 block">6-digit code</span>
                  <div className="flex justify-center py-1">
                    <OtpInputBoxes
                      value={code}
                      onChange={setCode}
                      disabled={busy}
                    />
                  </div>
                </div>
                <label className="block space-y-1">
                  <span className="text-xs text-gray-500">Name (optional, first time)</span>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How we should address you"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy || code.replace(/\D/g, "").length < 6}
                  className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-40"
                  onClick={handleVerifyCode}
                >
                  {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & continue"}
                </button>
              </div>
            )}
          </section>
        )}

        {token && user && (
          <section className="rounded-2xl border border-green-800/50 bg-green-950/20 p-6 space-y-4">
            <p className="text-sm text-gray-300">
              Signed in as{" "}
              <span className="text-white font-medium">
                {user.email ?? user.phone ?? user.name ?? user.id}
              </span>
            </p>
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-300 underline disabled:opacity-40"
              disabled={busy}
              onClick={() => {
                logout();
                toast.message("Signed out");
              }}
            >
              Use a different account
            </button>

            <div className="space-y-3 pt-2 border-t border-green-800/40">
              <button
                type="button"
                disabled={busy || lineDetails.length === 0 || !hasDeliveryInfo()}
                className="w-full py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 disabled:opacity-40 inline-flex items-center justify-center gap-2"
                onClick={() => void handleSubmitViaWhatsApp()}
              >
                {busy ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <MessageSquare className="w-6 h-6" />
                    Send order on WhatsApp
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                We save your order to your account, then open WhatsApp with the details. Tap send
                there so we can confirm price and delivery.
              </p>
            </div>
          </section>
        )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          <Link to="/menu" className="text-yellow-500 hover:underline">
            Add more from the menu
          </Link>
        </p>
      </div>
    </div>
  );
}
