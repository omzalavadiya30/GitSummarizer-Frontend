"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/auth/service";
import {
  clearSessionCookie,
  getStoredProfile,
  getToken,
  setSessionCookie,
  setStoredProfile,
  setStoredUserId,
  setToken,
} from "@/lib/auth/session";
import { LOGIN_ROUTE } from "@/lib/auth/constants";
import type { AuthUser, LoginInput, RegisterInput } from "@/lib/auth/types";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: Status;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  /** Single place that keeps cookie, stored user id, stores and state in sync. */
  const apply = useCallback((u: AuthUser | null) => {
    if (u) {
      setStoredUserId(u.id);
      setStoredProfile(u);
      setSessionCookie();
    } else {
      setStoredUserId(null);
      setStoredProfile(null);
      setToken(null);
      clearSessionCookie(); // must go first, or the proxy would bounce /login back to /dashboard
    }
    queryClient.clear();
    setUser(u);
    setStatus(u ? "authenticated" : "unauthenticated");
  }, [queryClient]);

  // Validate the stored session once on load (also drops a stale cookie).
  useEffect(() => {
    let alive = true;
    authService
      .me()
      .then((u) => alive && apply(u))
      .catch(() => {
        if (!alive) return;
        const cachedUser = getStoredProfile();
        if (getToken() && cachedUser) {
          setUser(cachedUser);
          setStatus("authenticated");
          return;
        }
        apply(null);
      });
    return () => {
      alive = false;
    };
  }, [apply]);

  const login = useCallback(
    async (input: LoginInput) => {
      const u = await authService.login(input);
      apply(u);
      return u;
    },
    [apply],
  );

  const register = useCallback(async (input: RegisterInput) => {
    const u = await authService.register(input);
    apply(u);
    return u;
  }, [apply]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* log out locally even if the server call fails */
    }
    apply(null);
    // Hard navigation: guarantees the proxy sees the cleared cookie and no
    // cached /dashboard page is shown.
    window.location.replace(LOGIN_ROUTE);
  }, [apply]);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
