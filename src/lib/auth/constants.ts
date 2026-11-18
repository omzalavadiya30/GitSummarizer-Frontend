// Shared by the proxy (server) and the client — keep this file free of browser APIs.

export const SESSION_COOKIE = "gs_session";

/** Reachable only while logged OUT. */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;

/** Reachable only while logged IN. */
export const PROTECTED_ROUTES = ["/dashboard"] as const;

export const LOGIN_ROUTE = "/login";
export const HOME_AFTER_LOGIN = "/dashboard";

/**
 * Route rules (see src/proxy.ts):
 *  - logged out: public routes are shown; /dashboard and ANY other URL -> /login
 *  - logged in : /dashboard is shown; /, /login, /register… and ANY other URL -> /dashboard
 */
export function resolveRoute(
  pathname: string,
  authenticated: boolean,
): { allow: true } | { allow: false; redirectTo: string } {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (authenticated) {
    return (PROTECTED_ROUTES as readonly string[]).includes(path)
      ? { allow: true }
      : { allow: false, redirectTo: HOME_AFTER_LOGIN };
  }
  return (PUBLIC_ROUTES as readonly string[]).includes(path)
    ? { allow: true }
    : { allow: false, redirectTo: LOGIN_ROUTE };
}
