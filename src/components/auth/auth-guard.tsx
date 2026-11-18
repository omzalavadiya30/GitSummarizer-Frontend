"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { LOGIN_ROUTE } from "@/lib/auth/constants";
import { useAuth } from "./auth-provider";

/**
 * Second line of defence behind the proxy: if the session turns out to be
 * invalid/expired once the app loads, leave the protected area.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") window.location.replace(LOGIN_ROUTE);
  }, [status]);

  if (status !== "authenticated") {
    return (
      <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <>{children}</>;
}
