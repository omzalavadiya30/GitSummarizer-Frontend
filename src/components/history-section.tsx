"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Download,
  Search,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useHistory } from "@/lib/storage";
import { formatCount, cn } from "@/lib/utils";

type Tab = "all" | "saved";

export function HistorySection() {
  const { entries, isLoading, toggleSaved, remove, clear } = useHistory();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const savedCount = entries.filter((e) => e.saved).length;

  const topLanguage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      if (e.language) counts.set(e.language, (counts.get(e.language) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [entries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (tab === "all" || e.saved) &&
        (!q ||
          e.fullName.toLowerCase().includes(q) ||
          (e.description ?? "").toLowerCase().includes(q) ||
          (e.language ?? "").toLowerCase().includes(q)),
    );
  }, [entries, tab, query]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gitsummarizer-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleSaved(url: string, wasSaved: boolean) {
    void toggleSaved(url)
      .then(() => toast.success(wasSaved ? "Removed from saved" : "Saved to your dashboard"))
      .catch(() => toast.error("Couldn't update the saved repository."));
  }

  function handleRemove(id: string) {
    void remove(id)
      .then(() => toast.success("Repository removed from history"))
      .catch(() => toast.error("Couldn't remove the repository."));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your repositories</h2>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Repos searched" value={String(entries.length)} />
        <Stat label="Saved" value={String(savedCount)} />
        <Stat label="Top language" value={topLanguage} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg bg-muted p-1" role="tablist">
          {(["all", "saved"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors",
                tab === t ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              {t === "all" ? "All searches" : `Saved (${savedCount})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter repositories…"
              aria-label="Filter repositories"
              className="h-9 pl-9"
            />
          </div>
          <Button variant="outline" onClick={exportJson} disabled={!entries.length} aria-label="Export as JSON">
            <Download />
          </Button>
          <Button
            variant="destructive"
            disabled={!entries.length}
            onClick={() => {
              if (window.confirm("Clear all searches? Saved repositories are kept.")) {
                void clear(true)
                  .then(() => toast.success("History cleared (saved items kept)"))
                  .catch(() => toast.error("Couldn't clear history."));
              }
            }}
          >
            <Trash2 /> Clear
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="py-10 text-center text-muted-foreground">Loading your history…</Card>
      ) : visible.length === 0 ? (
        <Card className="items-center py-14 text-center text-muted-foreground">
          {entries.length === 0
            ? "Nothing here yet."
            : tab === "saved" && !query
              ? "No saved repositories yet — use “Save” on a summary."
              : "No repositories match your filter."}
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((e) => (
            <li key={e.id}>
              <Card className="flex-row items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold">{e.fullName}</p>
                    {e.language && <Badge>{e.language}</Badge>}
                    {e.stars > 0 && <Badge>★ {formatCount(e.stars)}</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {e.summary.overview}
                  </p>
                  <p
                    className="mt-2 text-xs text-muted-foreground"
                    title={format(new Date(e.createdAt), "PPpp")}
                  >
                    {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={e.saved ? `Unsave ${e.fullName}` : `Save ${e.fullName}`}
                    onClick={() => handleSaved(e.url, e.saved)}
                  >
                    {e.saved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${e.fullName}`}
                    onClick={() => handleRemove(e.id)}
                  >
                    <Trash2 />
                  </Button>
                  <Link
                    href={`/dashboard?repo=${encodeURIComponent(e.url)}`}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Open <ArrowRight />
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-2xl font-bold">{value}</p>
    </Card>
  );
}
