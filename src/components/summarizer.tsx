"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ApiError, errorCopy, summarizeRepository } from "@/lib/api";
import { canonicalUrl, normalizeInput, parseGitHubUrl } from "@/lib/github-url";
import { useHistory } from "@/lib/storage";
import { RepoForm } from "@/components/repo-form";
import { RepoCard } from "@/components/repo-card";
import { CommitList } from "@/components/commit-list";
import { ReadmePreview } from "@/components/readme-preview";
import { SummaryView } from "@/components/summary-view";
import { ErrorState } from "@/components/error-state";
import { ProgressSteps, RepoCardSkeleton, SummarySkeleton } from "@/components/loading-states";

/** The backend fetches repository data, summarizes it, and records history in one request. */
export function Summarizer() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const raw = params.get("repo") ?? "";
  const parsed = parseGitHubUrl(normalizeInput(raw));
  const url = parsed ? canonicalUrl(raw) : "";

  const result = useQuery({
    queryKey: ["summary", url],
    queryFn: () => summarizeRepository(url),
    enabled: !!url,
  });
  const repository = result.data?.repository;
  const summary = result.data?.summary;

  useEffect(() => {
    if (result.error) toast.error(errorCopy(result.error).title, { id: "summary-error" });
  }, [result.error]);

  const { entries, toggleSaved } = useHistory();
  const recorded = useRef<string | null>(null);
  useEffect(() => {
    if (!url || !result.data || recorded.current === url) return;
    recorded.current = url;
    void queryClient.invalidateQueries({ queryKey: ["history"] });
  }, [url, result.data, queryClient]);

  const saved = entries.find((entry) => entry.url === url)?.saved ?? false;
  const loading = !!url && result.isFetching;

  function handleSubmit(value: string) {
    if (canonicalUrl(value) === url) {
      void result.refetch();
    } else {
      router.push(`/dashboard?repo=${encodeURIComponent(value)}`);
    }
  }

  const contentLoading = !result.data && result.isFetching;

  return (
    <div className="space-y-6">
      <RepoForm key={raw} initialValue={raw} loading={loading} onSubmit={handleSubmit} />

      {raw && !url && <ErrorState error={new ApiError("", "INVALID_GITHUB_URL")} />}

      {url && (
        <div className="space-y-4">
          {contentLoading && (
            <ProgressSteps
              steps={[
                { label: "Fetching repository", state: "active" },
                { label: "Reading README & commits", state: "pending" },
                { label: "Generating summary", state: "pending" },
              ]}
            />
          )}

          {repository ? (
            <RepoCard
              repo={repository}
              saved={saved}
              onToggleSaved={
                summary
                  ? () => {
                      void toggleSaved(url)
                        .then(() => toast.success(saved ? "Removed from saved" : "Saved to your dashboard"))
                        .catch(() => toast.error("Couldn't update the saved repository."));
                    }
                  : undefined
              }
            />
          ) : contentLoading ? (
            <RepoCardSkeleton />
          ) : (
            <ErrorState error={result.error} onRetry={() => void result.refetch()} />
          )}

          {summary ? (
            <SummaryView summary={summary} provider={result.data?.provider} />
          ) : contentLoading ? (
            <SummarySkeleton />
          ) : null}

          {repository && (
            <>
              <CommitList
                commits={repository.recentCommits ?? []}
                highlightSha={parsed?.commitSha}
              />
              <ReadmePreview readme={repository.readme} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
