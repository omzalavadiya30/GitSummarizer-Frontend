import { z } from "zod";

// Same character rules as the backend's GitHubRepositoryReference.
const NAME = "[A-Za-z0-9](?:[A-Za-z0-9._-]{0,98}[A-Za-z0-9])?";

// Accepts github.com/owner/repo with optional scheme, www., .git, trailing
// slash, extra path (/tree/main, /commit/<sha>), query or hash.
const REPO_RE = new RegExp(
  `^(?:https?://)?(?:www\\.)?github\\.com/(${NAME})/(${NAME})(?:/([^?#]*))?(?:[?#].*)?$`,
  "i",
);

export interface ParsedRepo {
  owner: string;
  repo: string;
  /** Present when the pasted link pointed at a specific commit. */
  commitSha?: string;
}

export function parseGitHubUrl(input: string): ParsedRepo | null {
  const m = input.trim().match(REPO_RE);
  if (!m) return null;
  const repo = m[2].replace(/\.git$/i, "");
  if (!repo) return null;
  const commit = m[3]?.match(/^commits?\/([0-9a-f]{7,40})/i);
  return { owner: m[1], repo, commitSha: commit?.[1] };
}

/** Shorthand "owner/repo" is also accepted and expanded. */
export function normalizeInput(input: string): string {
  const t = input.trim();
  return /^[\w.-]+\/[\w.-]+$/.test(t) && !t.includes("github.com")
    ? `https://github.com/${t}`
    : t;
}

export const repoUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Paste a GitHub repository URL")
    .refine(
      (v) => parseGitHubUrl(normalizeInput(v)) !== null,
      "Use a URL like https://github.com/owner/repo",
    ),
});

export type RepoUrlForm = z.infer<typeof repoUrlSchema>;

/** The exact form the backend accepts (it rejects any extra path or query). */
export function canonicalUrl(input: string): string {
  const p = parseGitHubUrl(normalizeInput(input));
  return p ? `https://github.com/${p.owner}/${p.repo}` : input.trim();
}
