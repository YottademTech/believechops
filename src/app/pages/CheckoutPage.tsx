import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import {
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Smartphone,
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
import { formatGhs } from "@/lib/money";
import { OtpInputBoxes } from "@/app/components/OtpInputBoxes";

type OtpChannel = "EMAIL" | "SMS";

export function CheckoutPage() {
  const { token, user, loading: authLoading, requestOtp, verifyOtp, logout } = useAuth();
  const {
    lineDetails,
    totalPesewas,
    itemCount,
    cartReady,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const [otpChannel, setOtpChannel] = useState<OtpChannel>("EMAIL");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "sent">("idle");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [momoWait, setMomoWait] = useState<{ reference: string; displayText: string | null } | null>(
    null,
  );
  /** Set after order is created so we can retry Paystack MoMo if the charge call fails. */
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!momoWait || !token) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await apiFetch(`/api/payments/verify/${encodeURIComponent(momoWait.reference)}`, {
          token,
        });
        if (cancelled || !res.ok) return;
        clear();
        setMomoWait(null);
        setPendingOrderId(null);
        setSubmitted(true);
        toast.success("Payment received — thank you!");
      } catch {
        /* still pending */
      }
    };
    void tick();
    const iv = window.setInterval(() => void tick(), 3500);
    const stop = window.setTimeout(() => clearInterval(iv), 190_000);
    return () => {
      cancelled = true;
      clearInterval(iv);
      clearTimeout(stop);
    };
  }, [momoWait, token, clear]);

  if (!authLoading && cartReady && itemCount === 0 && !submitted) {
    return <Navigate to="/menu" replace />;
  }

  async function handleSendCode() {
    setBusy(true);
    try {
      await requestOtp({
        channel: otpChannel,
        ...(otpChannel === "EMAIL"
          ? { email: email.trim() }
          : { phone: phone.trim() }),
      });
      setOtpStep("sent");
      toast.success("Check your inbox or phone for the code.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode() {
    setBusy(true);
    try {
      await verifyOtp({
        channel: otpChannel,
        ...(otpChannel === "EMAIL"
          ? { email: email.trim() }
          : { phone: phone.trim() }),
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

  async function startMomoForOrder(orderId: string) {
    if (!token) return;
    const payRes = await apiFetch("/api/payments/momo/charge", {
      method: "POST",
      token,
      body: JSON.stringify({ orderId }),
    });
    if (!payRes.ok) {
      const err = (await payRes.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? "Could not start Mobile Money payment");
    }
    const momo = (await payRes.json()) as {
      reference: string;
      displayText: string | null;
    };
    setMomoWait({ reference: momo.reference, displayText: momo.displayText });
    setPendingOrderId(null);
    toast.message("Check your phone for the MoMo prompt from Paystack.");
  }

  async function handlePayWithMomo() {
    if (!token || !user) return;
    if (!user.phoneVerifiedAt) {
      toast.error("Verify your phone on your profile before paying with Mobile Money.");
      return;
    }
    if (!hasDeliveryInfo()) {
      toast.error(
        "Choose a saved address or add Ghana Post / area / locality / GPS for this order.",
      );
      return;
    }
    setBusy(true);
    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          totalAmount: totalPesewas,
          currency: "GHS",
          delivery: buildDeliveryPayload(),
          items: {
            lines: lineDetails.map((l) => ({
              id: l.item.id,
              name: l.item.name,
              kind: l.item.kind,
              quantity: l.quantity,
              unitPricePesewas: l.item.pricePesewas,
              lineTotalPesewas: l.lineTotal,
            })),
          },
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Order failed");
      }
      const { order } = (await res.json()) as { order: { id: string } };
      setPendingOrderId(order.id);
      await startMomoForOrder(order.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleRetryMomo() {
    if (!token || !pendingOrderId) return;
    setBusy(true);
    try {
      await startMomoForOrder(pendingOrderId);
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
          <h1 className="text-3xl font-bold">Payment successful</h1>
          <p className="text-gray-400 leading-relaxed">
            Your Mobile Money payment went through on Paystack and your order is confirmed.
            We&apos;ll prepare your meal — thanks for choosing Believe Chops!
          </p>
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
            Pay with Ghana Mobile Money through Paystack — you&apos;ll approve the prompt on your
            verified phone number. Sign in if you haven&apos;t already.
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
                disabled={!!momoWait || savedAddresses.length === 0}
                onClick={() => setDeliveryMode("saved")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  deliveryMode === "saved" ? "bg-yellow-400 text-black" : "text-gray-400"
                } disabled:opacity-40`}
              >
                Saved address
              </button>
              <button
                type="button"
                disabled={!!momoWait}
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
                    disabled={!!momoWait}
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
                    disabled={!!momoWait || locating}
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
                      disabled={!!momoWait}
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
                    disabled={!!momoWait}
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
                    disabled={!!momoWait}
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
                    disabled={!!momoWait}
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
                  : "Add GPS and/or Ghana Post, community, or locality before you pay."}
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
                {lineDetails.map(({ item, quantity, lineTotal }) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatGhs(item.pricePesewas)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                        disabled={!!momoWait}
                        onClick={() => setQuantity(item.id, quantity - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                        disabled={!!momoWait}
                        onClick={() => setQuantity(item.id, quantity + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                      <span className="text-yellow-400 font-semibold ml-2 tabular-nums">
                        {formatGhs(lineTotal)}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-red-400 hover:underline ml-2 disabled:opacity-40"
                        disabled={!!momoWait}
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
              <div className="flex justify-between items-baseline gap-4 text-sm">
                <span className="text-gray-400">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-2xl font-bold text-yellow-400 tabular-nums">
                  {formatGhs(totalPesewas)}
                </span>
              </div>
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
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors ${
                  otpChannel === "EMAIL" ? "bg-yellow-400 text-black" : "text-gray-400"
                }`}
                onClick={() => {
                  setOtpChannel("EMAIL");
                  setOtpStep("idle");
                  setCode("");
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors ${
                  otpChannel === "SMS" ? "bg-yellow-400 text-black" : "text-gray-400"
                }`}
                onClick={() => {
                  setOtpChannel("SMS");
                  setOtpStep("idle");
                  setCode("");
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
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
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
                  className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233551234567"
                />
              </label>
            )}

            <button
              type="button"
              disabled={
                busy ||
                (otpChannel === "EMAIL" ? !email.includes("@") : phone.trim().length < 10)
              }
              className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold disabled:opacity-40"
              onClick={handleSendCode}
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send code"}
            </button>

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
              disabled={!!momoWait}
              onClick={() => {
                logout();
                toast.message("Signed out");
              }}
            >
              Use a different account
            </button>

            {momoWait ? (
              <div className="space-y-4 pt-2 border-t border-green-800/40">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-yellow-400">Approve on your phone</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {momoWait.displayText ||
                        "Paystack sent a Mobile Money prompt to your verified number. Approve it to pay."}
                    </p>
                    <p className="text-xs text-gray-500">
                      Waiting for confirmation… This page updates when Paystack marks the payment as
                      successful (often under a minute).
                    </p>
                  </div>
                </div>
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto" />
              </div>
            ) : !user.phoneVerifiedAt ? (
              <div className="space-y-3 pt-2 border-t border-green-800/40">
                <p className="text-sm text-amber-200">
                  To pay with Mobile Money, verify your phone number first — checkout uses the same
                  number Paystack will prompt.
                </p>
                <Link
                  to="/profile#verify-phone"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                >
                  Verify phone in profile
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={busy || lineDetails.length === 0 || !hasDeliveryInfo()}
                  className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 disabled:opacity-40"
                  onClick={() => void handlePayWithMomo()}
                >
                  {busy ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    "Pay with Mobile Money"
                  )}
                </button>
                {pendingOrderId && (
                  <button
                    type="button"
                    disabled={busy}
                    className="w-full py-2 rounded-xl border border-yellow-500/50 text-yellow-400 text-sm hover:bg-green-900/30 disabled:opacity-40"
                    onClick={() => void handleRetryMomo()}
                  >
                    {busy ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Retry MoMo prompt"
                    )}
                  </button>
                )}
                <p className="text-xs text-gray-500 text-center">
                  Paystack charges your total in GHS. The MoMo prompt goes to your verified phone (
                  {user.phone ?? "—"}).
                </p>
              </>
            )}
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
