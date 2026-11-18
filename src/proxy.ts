import { NextResponse, type NextRequest } from "next/server";
import { resolveRoute, SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Route guard (Next.js 16 "proxy", formerly middleware). It runs before any
 * page renders, so a logged-out user never even receives /dashboard.
 * This is a UX guard; the backend must still authorise its own API calls.
 */
export function proxy(request: NextRequest) {
  const authenticated = !!request.cookies.get(SESSION_COOKIE)?.value;
  const result = resolveRoute(request.nextUrl.pathname, authenticated);

  if (result.allow) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = result.redirectTo;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the API proxy, Next internals and static files (anything with a dot).
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
