"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60_000,
        },
      },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
