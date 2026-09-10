import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/lib/api/auth.api";
import { getAccessToken, setAccessToken } from "@/lib/api/client";
import type { User } from "@/types";

type AuthStatus = "idle" | "loading" | "authenticated" | "guest";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (body: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const queryClient = useQueryClient();

  const settle = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    setStatus(nextUser ? "authenticated" : "guest");
  }, []);

  // Silent refresh on boot: exchanges the httpOnly refresh cookie for a fresh access token.
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    authApi
      .refreshToken()
      .then(async ({ accessToken }) => {
        setAccessToken(accessToken);
        const { user: me } = await authApi.getMe();
        if (!cancelled) settle(me);
      })
      .catch(() => {
        if (!cancelled) settle(null);
      });
    return () => {
      cancelled = true;
    };
  }, [settle]);

  useEffect(() => {
    const onExpired = () => settle(null);
    window.addEventListener("auth:session-expired", onExpired);
    return () => window.removeEventListener("auth:session-expired", onExpired);
  }, [settle]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const res = await authApi.login({ identifier, password });
      setAccessToken(res.accessToken);
      settle(res.user);
      return res.user;
    },
    [settle],
  );

  const register = useCallback(
    async (body: { name: string; email: string; password: string }) => {
      const res = await authApi.register(body);
      setAccessToken(res.accessToken);
      settle(res.user);
      return res.user;
    },
    [settle],
  );

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    settle(null);
    queryClient.clear();
  }, [settle, queryClient]);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) return;
    const { user: me } = await authApi.getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, isAuthenticated: status === "authenticated", login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
