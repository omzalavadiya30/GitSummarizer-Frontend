import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

/** Header for the landing page: Sign in / Sign up. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1.5" aria-label="Account">
          <ThemeToggle />
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-3")}>
            Sign in
          </Link>
          <Link href="/register" className={cn(buttonVariants(), "h-9 px-3.5")}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
