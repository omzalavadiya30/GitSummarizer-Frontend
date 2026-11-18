"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dark mode via the `.dark` class (set before first paint by the script in layout.tsx).
 * Both icons are always rendered and CSS picks the visible one, so the server and
 * client HTML are identical and there is no hydration mismatch.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggle}>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}