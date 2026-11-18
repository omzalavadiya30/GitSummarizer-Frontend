"use client";

import { Suspense } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Summarizer } from "@/components/summarizer";
import { HistorySection } from "@/components/history-section";

/** The single signed-in screen: new summary on top, history & saved below. */
export function DashboardView() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="space-y-12">
      <section id="new-summary" className="scroll-mt-20 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Paste a public GitHub repository URL to get an overview, features, prerequisites and
            release notes.
          </p>
        </div>
        {/* useSearchParams requires a Suspense boundary */}
        <Suspense>
          <Summarizer />
        </Suspense>
      </section>

      <HistorySection />
    </div>
  );
}
