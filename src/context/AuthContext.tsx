import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, type ApiUser } from "@/lib/api";

const STORAGE_KEY = "believechops_token";

type AuthContextValue = {
  token: string | null;
  user: ApiUser | null;
  loading: boolean;
  setSession: (token: string, user: ApiUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  requestOtp: (input: {
    channel: "EMAIL" | "SMS";
    email?: string;
    phone?: string;
  }) => Promise<void>;
  verifyOtp: (input: {
    channel: "EMAIL" | "SMS";
    email?: string;
    phone?: string;
    code: string;
    name?: string;
  }) => Promise<void>;
  updateProfile: (input: { name?: string }) => Promise<void>;
  requestContactOtp: (input: {
    channel: "EMAIL" | "SMS";
    email?: string;
    phone?: string;
  }) => Promise<void>;
  verifyContactOtp: (input: {
    channel: "EMAIL" | "SMS";
    email?: string;
    phone?: string;
    code: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null,
  );
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch("/api/auth/me", { token });
      if (!res.ok) {
        throw new Error("me_failed");
      }
      const data = (await res.json()) as { user: ApiUser };
      setUser(data.user);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const setSession = useCallback((newToken: string, u: ApiUser) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const requestOtp = useCallback(
    async (input: {
      channel: "EMAIL" | "SMS";
      email?: string;
      phone?: string;
    }) => {
      const res = await apiFetch("/api/auth/otp/send", {
        method: "POST",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Could not send verification code");
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (input: {
      channel: "EMAIL" | "SMS";
      email?: string;
      phone?: string;
      code: string;
      name?: string;
    }) => {
      const res = await apiFetch("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Invalid code");
      }
      const data = (await res.json()) as { token: string; user: ApiUser };
      setSession(data.token, data.user);
    },
    [setSession],
  );

  const updateProfile = useCallback(
    async (input: { name?: string }) => {
      if (!token) {
        throw new Error("Not signed in");
      }
      const res = await apiFetch("/api/auth/me", {
        method: "PATCH",
        token,
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Could not update profile");
      }
      const data = (await res.json()) as { user: ApiUser };
      setUser(data.user);
    },
    [token],
  );

  const requestContactOtp = useCallback(
    async (input: {
      channel: "EMAIL" | "SMS";
      email?: string;
      phone?: string;
    }) => {
      if (!token) throw new Error("Not signed in");
      const res = await apiFetch("/api/auth/contact/send", {
        method: "POST",
        token,
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Could not send verification code");
      }
    },
    [token],
  );

  const verifyContactOtp = useCallback(
    async (input: {
      channel: "EMAIL" | "SMS";
      email?: string;
      phone?: string;
      code: string;
    }) => {
      if (!token) throw new Error("Not signed in");
      const res = await apiFetch("/api/auth/contact/verify", {
        method: "POST",
        token,
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? "Verification failed");
      }
      const data = (await res.json()) as { user: ApiUser };
      setUser(data.user);
    },
    [token],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      setSession,
      logout,
      refreshUser,
      requestOtp,
      verifyOtp,
      updateProfile,
      requestContactOtp,
      verifyContactOtp,
    }),
    [
      token,
      user,
      loading,
      setSession,
      logout,
      refreshUser,
      requestOtp,
      verifyOtp,
      updateProfile,
      requestContactOtp,
      verifyContactOtp,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
