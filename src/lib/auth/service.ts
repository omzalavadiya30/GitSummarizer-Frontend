import { apiAuthService } from "./api-service";
import { mockAuthService } from "./mock-service";
import type { AuthService } from "./types";

/** API auth is the default. Use mock mode only for an isolated UI preview. */
export const AUTH_MODE = process.env.AUTH_MODE === "mock" ? "mock" : "api";

export const authService: AuthService =
  AUTH_MODE === "api" ? apiAuthService : mockAuthService;
