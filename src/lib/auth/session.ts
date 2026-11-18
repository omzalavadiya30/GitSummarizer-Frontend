import { SESSION_COOKIE } from "./constants";
import type { AuthUser } from "./types";

// Client-side session helpers. Every storage access is guarded: it can throw
// in private mode or when site data is blocked.

const TOKEN_KEY = "gs:token";
const USER_KEY = "gs:user-id";
const PROFILE_KEY = "gs:user-profile";
const WEEK = 7 * 24 * 60 * 60;

/**
 * The cookie only tells the proxy "a session exists" so it can route.
 * For production the backend should set it as an httpOnly cookie instead.
 */
export function setSessionCookie() {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${WEEK}; SameSite=Lax${secure}`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function set(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export const getToken = () => get(TOKEN_KEY);
export const setToken = (t: string | null) => set(TOKEN_KEY, t);
export const getStoredUserId = () => get(USER_KEY);
export const setStoredUserId = (id: string | null) => set(USER_KEY, id);

export function getStoredProfile(): AuthUser | null {
  try {
    const raw = get(PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw) as Partial<AuthUser>;
    return typeof profile.id === "string" && typeof profile.name === "string" && typeof profile.email === "string"
      ? { id: profile.id, name: profile.name, email: profile.email }
      : null;
  } catch {
    return null;
  }
}

export function setStoredProfile(user: AuthUser | null) {
  set(PROFILE_KEY, user ? JSON.stringify(user) : null);
}

/** Adds the bearer token (API mode) to outgoing backend requests. */
export function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
