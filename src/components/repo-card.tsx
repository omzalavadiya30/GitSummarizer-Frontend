"use client";

import { Bookmark, BookmarkCheck, Code, ExternalLink, GitBranch, GitFork, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepository } from "@/lib/types";
import { formatCount } from "@/lib/utils";

interface Props {
  repo: GitHubRepository;
  saved?: boolean;
  /** Shown only once there is something to save. */
  onToggleSaved?: () => void;
}

export function RepoCard({ repo, saved, onToggleSaved }: Props) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold">{repo.fullName}</h2>
          {repo.description && (
            <p className="mt-1 text-sm text-muted-foreground">{repo.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onToggleSaved && (
            <Button variant={saved ? "secondary" : "outline"} onClick={onToggleSaved}>
              {saved ? <BookmarkCheck /> : <Bookmark />}
              {saved ? "Saved" : "Save"}
            </Button>
          )}
          <a
            href={repo.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ExternalLink className="size-4" /> GitHub
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge><Star className="size-3" /> {formatCount(repo.stars)} stars</Badge>
        <Badge><GitFork className="size-3" /> {formatCount(repo.forks)} forks</Badge>
        {repo.primaryLanguage && (
          <Badge><Code className="size-3" /> {repo.primaryLanguage}</Badge>
        )}
        <Badge><GitBranch className="size-3" /> {repo.defaultBranch}</Badge>
      </div>
    </Card>
  );
}
