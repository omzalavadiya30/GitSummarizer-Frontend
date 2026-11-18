"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-24 text-center">
      <p className="text-lg font-semibold">Something went wrong</p>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred while rendering this page.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
