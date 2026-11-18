import { formatDistanceToNow } from "date-fns";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GitHubCommit } from "@/lib/types";

function ago(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : formatDistanceToNow(d, { addSuffix: true });
}

export function CommitList({
  commits,
  highlightSha,
}: {
  commits: GitHubCommit[];
  /** A commit the user linked to; it's marked if it is among the recent ones. */
  highlightSha?: string;
}) {
  if (commits.length === 0) return null;
  return (
    <Card>
      <CardTitle>Recent commits</CardTitle>
      <ul className="divide-y">
        {commits.map((c) => {
          const title = c.message.split("\n")[0];
          const linked =
            !!highlightSha &&
            (c.sha.startsWith(highlightSha) || highlightSha.startsWith(c.sha));
          return (
            <li key={c.sha} className="flex items-start gap-3 py-2.5 text-sm">
              <a
                href={c.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary hover:underline"
              >
                {c.sha.slice(0, 7)}
              </a>
              <div className="min-w-0 flex-1">
                <p className="truncate">
                  {title}
                  {linked && <Badge className="ml-2">linked commit</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.author ?? "Unknown author"}
                  {c.committedAt ? ` · ${ago(c.committedAt)}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
