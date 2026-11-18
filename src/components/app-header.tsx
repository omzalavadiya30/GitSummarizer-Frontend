"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useAuth } from "@/components/auth/auth-provider";

/** Header for signed-in pages. */
export function AppHeader() {
  const { user, logout } = useAuth();
  const initial = (user?.name ?? "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-1.5">
          <div className="mr-1 flex items-center gap-2" title={user?.email}>
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-muted text-sm font-semibold"
            >
              {initial}
            </span>
            <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
              {user?.name}
            </span>
          </div>
          <ThemeToggle />
          <Button variant="destructive" onClick={() => void logout()}>
            <LogOut /> <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
