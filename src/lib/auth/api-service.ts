import { authHeaders, getToken, setToken } from "./session";
import { apiUrl } from "../api-url";
import { AuthError, type AuthService, type AuthUser } from "./types";

interface Opts {
  method?: "GET" | "POST";
  body?: unknown;
  auth?: boolean;
}

async function request(path: string, { method = "GET", body, auth }: Opts = {}): Promise<Response> {
  const url = apiUrl(`/auth${path}`);
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(auth ? authHeaders() : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new AuthError("NETWORK_ERROR");
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;
    const fallback =
      response.status === 401 ? "INVALID_CREDENTIALS"
      : response.status === 409 ? "EMAIL_TAKEN"
      : response.status === 400 ? "INVALID_REQUEST"
      : response.status >= 500 ? "NETWORK_ERROR"
      : "UNKNOWN";
    throw new AuthError(data?.code ?? fallback, data?.message ?? "");
  }
  return response;
}

async function call<T>(path: string, opts?: Opts): Promise<T> {
  const response = await request(path, opts);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

interface TokenResponse {
  token: string;
  user: AuthUser;
}

export const apiAuthService: AuthService = {
  async me() {
    if (!getToken()) return null;
    try {
      return await call<AuthUser>("/me", { auth: true });
    } catch (error) {
      if (error instanceof AuthError && error.code === "INVALID_CREDENTIALS") {
        setToken(null);
        return null;
      }
      throw error;
    }
  },

  async login(input) {
    const result = await call<TokenResponse>("/login", { method: "POST", body: input });
    setToken(result.token);
    return result.user;
  },

  async register(input) {
    const result = await call<TokenResponse>("/register", { method: "POST", body: input });
    setToken(result.token);
    return result.user;
  },

  async logout() {
    try {
      await call<void>("/logout", { method: "POST", auth: true });
    } finally {
      setToken(null);
    }
  },

  async forgotPassword(email) {
    const response = await request("/forgot-password", { method: "POST", body: { email } });
    return { devResetLink: response.headers.get("X-Dev-Reset-Link") ?? undefined };
  },

  async resetPassword(input) {
    await call<void>("/reset-password", { method: "POST", body: input });
  },
};
