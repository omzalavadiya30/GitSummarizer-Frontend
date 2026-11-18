import {
  AuthError,
  type AuthService,
  type AuthUser,
} from "./types";

/**
 * LOCAL-ONLY auth for development while the backend has no auth endpoints.
 * Accounts live in this browser's localStorage and passwords are hashed with
 * SHA-256 — fine for a demo, NOT real security. Switch to the real backend with
 * NEXT_PUBLIC_AUTH_MODE=api (see README).
 */

interface StoredUser extends AuthUser {
  passwordHash: string;
}
interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

const USERS = "gs:mock:users";
const SESSION = "gs:mock:session";
const RESETS = "gs:mock:resets";
const RESET_TTL_MS = 30 * 60_000;

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new AuthError("UNKNOWN", "Browser storage is unavailable.");
  }
}

async function hash(email: string, password: string) {
  const data = new TextEncoder().encode(`${email.toLowerCase()}:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const strip = ({ id, name, email }: StoredUser): AuthUser => ({ id, name, email });
const norm = (email: string) => email.trim().toLowerCase();

export const mockAuthService: AuthService = {
  async me() {
    const session = load<{ userId: string } | null>(SESSION, null);
    if (!session) return null;
    const user = load<StoredUser[]>(USERS, []).find((u) => u.id === session.userId);
    return user ? strip(user) : null;
  },

  async login({ email, password }) {
    await delay();
    const users = load<StoredUser[]>(USERS, []);
    const user = users.find((u) => u.email === norm(email));
    if (!user || user.passwordHash !== (await hash(user.email, password))) {
      throw new AuthError("INVALID_CREDENTIALS");
    }
    save(SESSION, { userId: user.id });
    return strip(user);
  },

  async register({ name, email, password }) {
    await delay();
    const users = load<StoredUser[]>(USERS, []);
    const e = norm(email);
    if (users.some((u) => u.email === e)) throw new AuthError("EMAIL_TAKEN");
    const user: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: e,
      passwordHash: await hash(e, password),
    };
    save(USERS, [...users, user]);
    save(SESSION, { userId: user.id });
    return strip(user);
  },

  async logout() {
    try {
      localStorage.removeItem(SESSION);
    } catch {
      /* ignore */
    }
  },

  async forgotPassword(email) {
    await delay();
    const e = norm(email);
    const exists = load<StoredUser[]>(USERS, []).some((u) => u.email === e);
    if (!exists) return {}; // same response either way: don't reveal who has an account
    const token = crypto.randomUUID().replace(/-/g, "");
    const resets = load<ResetToken[]>(RESETS, []).filter(
      (r) => r.expiresAt > Date.now() && r.email !== e,
    );
    save(RESETS, [...resets, { token, email: e, expiresAt: Date.now() + RESET_TTL_MS }]);
    // No email server in mock mode, so hand the link back to the UI.
    return { devResetLink: `/reset-password?token=${token}` };
  },

  async resetPassword({ token, password }) {
    await delay();
    const resets = load<ResetToken[]>(RESETS, []);
    const reset = resets.find((r) => r.token === token && r.expiresAt > Date.now());
    if (!reset) throw new AuthError("INVALID_TOKEN");
    const users = load<StoredUser[]>(USERS, []);
    const idx = users.findIndex((u) => u.email === reset.email);
    if (idx === -1) throw new AuthError("INVALID_TOKEN");
    users[idx] = { ...users[idx], passwordHash: await hash(reset.email, password) };
    save(USERS, users);
    save(RESETS, resets.filter((r) => r.token !== token));
  },
};
