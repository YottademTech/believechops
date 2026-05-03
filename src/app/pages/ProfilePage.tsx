import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Smartphone, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  deliveryPayloadHasContent,
  formatAddressOption,
  type ApiAddress,
} from "@/lib/addresses";
import { getUserInitials } from "@/lib/profile";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { OtpInputBoxes } from "@/app/components/OtpInputBoxes";

export function ProfilePage() {
  const {
    user,
    loading,
    token,
    updateProfile,
    requestContactOtp,
    verifyContactOtp,
  } = useAuth();
  const location = useLocation();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [emailDraft, setEmailDraft] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [busyEmail, setBusyEmail] = useState(false);

  const [phoneDraft, setPhoneDraft] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [busyPhone, setBusyPhone] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<ApiAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addrLabel, setAddrLabel] = useState("");
  const [addrGhanaPost, setAddrGhanaPost] = useState("");
  const [addrCommunity, setAddrCommunity] = useState("");
  const [addrLocality, setAddrLocality] = useState("");
  const [addrGeo, setAddrGeo] = useState<{
    lat: number;
    lng: number;
    accuracyM?: number;
  } | null>(null);
  const [addrLocating, setAddrLocating] = useState(false);
  const [addrBusy, setAddrBusy] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  async function refreshAddresses() {
    if (!token) return;
    setLoadingAddresses(true);
    try {
      const res = await apiFetch("/api/addresses", { token });
      if (!res.ok) throw new Error("addresses_failed");
      const data = (await res.json()) as { addresses: ApiAddress[] };
      setSavedAddresses(data.addresses ?? []);
    } catch {
      toast.error("Could not load saved addresses");
    } finally {
      setLoadingAddresses(false);
    }
  }

  useEffect(() => {
    void refreshAddresses();
  }, [token]);

  useEffect(() => {
    if (location.hash === "#saved-addresses") {
      requestAnimationFrame(() => {
        document.getElementById("saved-addresses")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location.hash]);

  function resetAddressForm() {
    setAddrLabel("");
    setAddrGhanaPost("");
    setAddrCommunity("");
    setAddrLocality("");
    setAddrGeo(null);
    setEditingAddressId(null);
  }

  function fillAddressForm(a: ApiAddress) {
    setEditingAddressId(a.id);
    setAddrLabel(a.label ?? "");
    setAddrGhanaPost(a.ghanaPost ?? "");
    setAddrCommunity(a.community ?? "");
    setAddrLocality(a.locality ?? "");
    setAddrGeo(
      a.geo
        ? {
            lat: a.geo.lat,
            lng: a.geo.lng,
            accuracyM: a.geo.accuracyM,
          }
        : null,
    );
  }

  function buildProfileAddressBody(): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    if (addrLabel.trim()) body.label = addrLabel.trim();
    if (addrGhanaPost.trim()) body.ghanaPost = addrGhanaPost.trim();
    if (addrCommunity.trim()) body.community = addrCommunity.trim();
    if (addrLocality.trim()) body.locality = addrLocality.trim();
    if (addrGeo) {
      body.geo = {
        lat: addrGeo.lat,
        lng: addrGeo.lng,
        ...(addrGeo.accuracyM != null ? { accuracyM: Math.round(addrGeo.accuracyM) } : {}),
      };
    }
    return body;
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const body = buildProfileAddressBody();
    if (!deliveryPayloadHasContent(body)) {
      toast.error("Add Ghana Post, community, locality, or share your location.");
      return;
    }
    setAddrBusy(true);
    try {
      if (editingAddressId) {
        const res = await apiFetch(`/api/addresses/${editingAddressId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(err.error ?? "Could not update address");
        }
        toast.success("Address updated");
      } else {
        const res = await apiFetch("/api/addresses", {
          method: "POST",
          token,
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(err.error ?? "Could not save address");
        }
        toast.success("Address saved");
      }
      resetAddressForm();
      await refreshAddresses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAddrBusy(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!token || !confirm("Remove this saved address?")) return;
    setAddrBusy(true);
    try {
      const res = await apiFetch(`/api/addresses/${id}`, { method: "DELETE", token });
      if (!res.ok) throw new Error("delete_failed");
      toast.success("Address removed");
      if (editingAddressId === id) resetAddressForm();
      await refreshAddresses();
    } catch {
      toast.error("Could not delete address");
    } finally {
      setAddrBusy(false);
    }
  }

  function handleAddrShareLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser.");
      return;
    }
    setAddrLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddrGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM:
            pos.coords.accuracy != null && Number.isFinite(pos.coords.accuracy)
              ? pos.coords.accuracy
              : undefined,
        });
        setAddrLocating(false);
        toast.success("Location captured.");
      },
      () => {
        setAddrLocating(false);
        toast.error("Could not read your location.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  }

  useEffect(() => {
    if (user?.name) setName(user.name);
    else setName("");
  }, [user]);

  useEffect(() => {
    if (user?.email) setEmailDraft(user.email);
    else setEmailDraft("");
    setEmailCode("");
    setEmailCodeSent(false);
  }, [user?.email, user?.emailVerifiedAt]);

  useEffect(() => {
    if (user?.phone) setPhoneDraft(user.phone);
    else setPhoneDraft("");
    setPhoneCode("");
    setPhoneCodeSent(false);
  }, [user?.phone, user?.phoneVerifiedAt]);

  useEffect(() => {
    if (location.hash === "#edit") {
      requestAnimationFrame(() => {
        document.getElementById("edit-profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleEmailSend() {
    const trimmed = emailDraft.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setBusyEmail(true);
    try {
      await requestContactOtp({ channel: "EMAIL", email: trimmed });
      setEmailCodeSent(true);
      toast.success("Check your inbox for the code.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setBusyEmail(false);
    }
  }

  async function handleEmailVerify() {
    const trimmed = emailDraft.trim().toLowerCase();
    setBusyEmail(true);
    try {
      await verifyContactOtp({
        channel: "EMAIL",
        email: trimmed,
        code: emailCode.replace(/\D/g, ""),
      });
      toast.success("Email verified");
      setEmailCode("");
      setEmailCodeSent(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusyEmail(false);
    }
  }

  async function handlePhoneSend() {
    const trimmed = phoneDraft.trim();
    if (trimmed.length < 10) {
      toast.error("Use international format, e.g. +233551234567");
      return;
    }
    setBusyPhone(true);
    try {
      await requestContactOtp({ channel: "SMS", phone: trimmed });
      setPhoneCodeSent(true);
      toast.success("Check your phone for the code.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setBusyPhone(false);
    }
  }

  async function handlePhoneVerify() {
    const trimmed = phoneDraft.trim();
    setBusyPhone(true);
    try {
      await verifyContactOtp({
        channel: "SMS",
        phone: trimmed,
        code: phoneCode.replace(/\D/g, ""),
      });
      toast.success("Phone verified");
      setPhoneCode("");
      setPhoneCodeSent(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusyPhone(false);
    }
  }

  const emailMatchesVerified =
    user?.email &&
    user.emailVerifiedAt &&
    emailDraft.trim().toLowerCase() === user.email.toLowerCase();
  const phoneMatchesVerified =
    user?.phone && user.phoneVerifiedAt && phoneDraft.trim() === user.phone;

  if (!loading && !token) {
    return <Navigate to="/" replace />;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  const initials = getUserInitials(user);
  const displayName = user.name?.trim() || "Add your name";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-yellow-400 shadow-lg">
            <AvatarFallback className="bg-yellow-400 text-black font-bold text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-gray-400 text-sm mt-1">Your Believe Chops account</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="space-y-8 lg:col-span-7">
        <section className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-400">Email</h2>
          <p className="text-xs text-gray-500">
            Signed in with email? Add or change your address — we&apos;ll send a code to confirm.
          </p>
          <div className="text-sm space-y-1">
            <span className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Current
            </span>
            <p className="text-white">{user.email ?? "—"}</p>
            {user.emailVerifiedAt && (
              <p className="text-xs text-green-400">Verified</p>
            )}
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">New email</span>
              <input
                type="email"
                autoComplete="email"
                value={emailDraft}
                onChange={(e) => {
                  setEmailDraft(e.target.value);
                  setEmailCodeSent(false);
                  setEmailCode("");
                }}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="button"
              disabled={busyEmail || emailMatchesVerified || !emailDraft.trim()}
              onClick={handleEmailSend}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold text-sm disabled:opacity-40"
            >
              {busyEmail ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send verification code"}
            </button>
            {emailCodeSent && (
              <div className="space-y-3">
                <span className="text-xs text-gray-500 block">6-digit code</span>
                <div className="flex justify-center py-1">
                  <OtpInputBoxes
                    value={emailCode}
                    onChange={setEmailCode}
                    disabled={busyEmail}
                  />
                </div>
                <button
                  type="button"
                  disabled={busyEmail || emailCode.replace(/\D/g, "").length !== 6}
                  onClick={handleEmailVerify}
                  className="w-full py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 disabled:opacity-40"
                >
                  {busyEmail ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify email"}
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="verify-phone" className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-400">Phone</h2>
          <p className="text-xs text-gray-500">
            Signed in with SMS? Add or change your number — we&apos;ll text a code to confirm.
          </p>
          <div className="text-sm space-y-1">
            <span className="text-gray-500 flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Current
            </span>
            <p className="text-white">{user.phone ?? "—"}</p>
            {user.phoneVerifiedAt && (
              <p className="text-xs text-green-400">Verified</p>
            )}
          </div>
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">New phone (E.164)</span>
              <input
                type="tel"
                autoComplete="tel"
                value={phoneDraft}
                onChange={(e) => {
                  setPhoneDraft(e.target.value);
                  setPhoneCodeSent(false);
                  setPhoneCode("");
                }}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                placeholder="+233551234567"
              />
            </label>
            <button
              type="button"
              disabled={busyPhone || phoneMatchesVerified || phoneDraft.trim().length < 10}
              onClick={handlePhoneSend}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold text-sm disabled:opacity-40"
            >
              {busyPhone ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send verification code"}
            </button>
            {phoneCodeSent && (
              <div className="space-y-3">
                <span className="text-xs text-gray-500 block">6-digit code</span>
                <div className="flex justify-center py-1">
                  <OtpInputBoxes
                    value={phoneCode}
                    onChange={setPhoneCode}
                    disabled={busyPhone}
                  />
                </div>
                <button
                  type="button"
                  disabled={busyPhone || phoneCode.replace(/\D/g, "").length !== 6}
                  onClick={handlePhoneVerify}
                  className="w-full py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 disabled:opacity-40"
                >
                  {busyPhone ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify phone"}
                </button>
              </div>
            )}
          </div>
        </section>
          </div>

          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
        <section id="edit-profile" className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-400">Display name</h2>
          <p className="text-sm text-gray-400">
            This is shown in your account menu. Email and phone are verified in the left column.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-gray-400">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white placeholder:text-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                placeholder="Your name"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save name"}
            </button>
          </form>
        </section>

        <section id="saved-addresses" className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Saved addresses
          </h2>
          <p className="text-xs text-gray-500">
            Store Ghana Post codes, community, directions, or GPS — then pick one at checkout or
            enter a one-off address.
          </p>

          {loadingAddresses ? (
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto" />
          ) : savedAddresses.length > 0 ? (
            <ul className="space-y-3">
              {savedAddresses.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-gray-700 bg-black/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-white">{formatAddressOption(a)}</p>
                    <div className="text-gray-400 text-xs space-y-0.5">
                      {a.ghanaPost && <p>Ghana Post: {a.ghanaPost}</p>}
                      {a.community && <p>Area: {a.community}</p>}
                      {a.locality && <p>{a.locality}</p>}
                      {a.geo && (
                        <p className="text-green-400/90 tabular-nums">
                          GPS {a.geo.lat.toFixed(5)}, {a.geo.lng.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={addrBusy}
                      onClick={() => fillAddressForm(a)}
                      className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={addrBusy}
                      onClick={() => void handleDeleteAddress(a.id)}
                      className="px-3 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-950/40 text-sm disabled:opacity-40 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No saved addresses yet.</p>
          )}

          <form onSubmit={handleSaveAddress} className="space-y-3 pt-2 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              {editingAddressId ? "Update this address" : "Add a new address"}
            </p>
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">Label (optional)</span>
              <input
                type="text"
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
                maxLength={80}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
                placeholder="Home, Work…"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={addrBusy || addrLocating}
                onClick={handleAddrShareLocation}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-800 hover:bg-gray-700 px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                {addrLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 text-yellow-400" />
                )}
                Share location
              </button>
              {addrGeo && (
                <button
                  type="button"
                  disabled={addrBusy}
                  onClick={() => setAddrGeo(null)}
                  className="rounded-xl border border-gray-600 px-4 py-2.5 text-sm text-gray-300"
                >
                  Clear GPS
                </button>
              )}
            </div>
            {addrGeo && (
              <p className="text-xs text-green-400/90 tabular-nums">
                GPS ({addrGeo.lat.toFixed(5)}, {addrGeo.lng.toFixed(5)})
              </p>
            )}
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">Ghana Post</span>
              <input
                type="text"
                value={addrGhanaPost}
                onChange={(e) => setAddrGhanaPost(e.target.value)}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
                placeholder="Digital address"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">Community</span>
              <input
                type="text"
                value={addrCommunity}
                onChange={(e) => setAddrCommunity(e.target.value)}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-gray-500">Locality / directions</span>
              <textarea
                value={addrLocality}
                onChange={(e) => setAddrLocality(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-black border border-gray-700 px-4 py-3 text-white resize-y min-h-[80px]"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={addrBusy}
                className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-40"
              >
                {addrBusy ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : editingAddressId ? (
                  "Update address"
                ) : (
                  "Save address"
                )}
              </button>
              {editingAddressId && (
                <button
                  type="button"
                  disabled={addrBusy}
                  onClick={resetAddressForm}
                  className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}
