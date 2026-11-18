"use client";

import { Check, Copy, Info, ListChecks, Rocket, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import type { RepositorySummary } from "@/lib/types";

export function summaryToMarkdown(s: RepositorySummary): string {
  const list = (xs: string[]) => (xs.length ? xs.map((x) => `- ${x}`).join("\n") : "_None_");
  return [
    `## Overview\n\n${s.overview}`,
    `## Key features\n\n${list(s.features ?? [])}`,
    `## Prerequisites\n\n${list(s.prerequisites ?? [])}`,
    `## Release notes\n\n${s.releaseNotes}`,
  ].join("\n\n");
}

export function SummaryView({ summary, provider }: { summary: RepositorySummary; provider?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(summaryToMarkdown(summary));
      toast.success("Summary copied as Markdown");
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>
            <Info className="size-4 text-primary" /> Overview
          </CardTitle>
          {provider && <Badge>{provider}</Badge>}
          <Button variant="ghost" size="sm" onClick={copy}>
            <Copy /> Copy Markdown
          </Button>
        </div>
        <Markdown>{summary.overview}</Markdown>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Key features" icon={<ListChecks className="size-4" />} items={summary.features} />
        <ListCard title="Prerequisites" icon={<Wrench className="size-4" />} items={summary.prerequisites} />
      </div>

      <Card>
        <CardTitle>
          <Rocket className="size-4 text-primary" /> Release notes
        </CardTitle>
        <Markdown>{summary.releaseNotes}</Markdown>
      </Card>
    </div>
  );
}

function ListCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[] | null;
}) {
  return (
    <Card>
      <CardTitle>
        <span className="text-primary">{icon}</span> {title}
      </CardTitle>
      {items && items.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing listed.</p>
      )}
    </Card>
  );
}
