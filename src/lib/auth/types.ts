export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface AuthService {
  /** Current user from the stored session, or null when logged out/expired. */
  me(): Promise<AuthUser | null>;
  login(input: LoginInput): Promise<AuthUser>;
  register(input: RegisterInput): Promise<AuthUser>;
  logout(): Promise<void>;
  /** Always resolves the same way whether or not the email exists. */
  forgotPassword(email: string): Promise<{ devResetLink?: string }>;
  resetPassword(input: { token: string; password: string }): Promise<void>;
}

export class AuthError extends Error {
  constructor(
    public readonly code: string,
    message = "",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Incorrect email or password.",
  EMAIL_TAKEN: "An account with this email already exists. Try signing in.",
  INVALID_TOKEN: "This reset link is invalid or has expired. Request a new one.",
  INVALID_REQUEST: "Please check the details you entered.",
  NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
  UNKNOWN: "Something went wrong. Please try again.",
};

export function authErrorMessage(err: unknown): string {
  if (err instanceof AuthError) return MESSAGES[err.code] ?? (err.message || MESSAGES.UNKNOWN);
  return MESSAGES.UNKNOWN;
}
