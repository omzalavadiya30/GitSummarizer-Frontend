import { authHeaders } from "./auth/session";
import { apiUrl } from "./api-url";
import type {
  ApiErrorBody,
  GitHubRepository,
  HistoryEntry,
  SummaryResult,
} from "./types";

/** Normalised error thrown by every API helper. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorCopy {
  title: string;
  hint?: string;
}

/** Friendly copy for every error code the backend can return. */
const ERROR_COPY: Record<string, ErrorCopy> = {
  INVALID_GITHUB_URL: {
    title: "That doesn't look like a GitHub repository URL",
    hint: "Use the form https://github.com/owner/repository.",
  },
  INVALID_REQUEST: { title: "Please enter a GitHub repository URL" },
  GITHUB_REPOSITORY_NOT_FOUND: {
    title: "Repository not found",
    hint: "Check the spelling. Private repositories aren't supported — only public ones can be summarized.",
  },
  GITHUB_ACCESS_DENIED: {
    title: "Access to this repository was denied",
    hint: "It may be private or restricted. Only public repositories are supported.",
  },
  GITHUB_AUTHENTICATION_FAILED: {
    title: "The server's GitHub token was rejected",
    hint: "Ask the backend maintainer to check the GITHUB_TOKEN setting.",
  },
  GITHUB_RATE_LIMITED: {
    title: "GitHub rate limit reached",
    hint: "Wait a few minutes and retry. A server-side GITHUB_TOKEN raises the limit.",
  },
  GITHUB_UPSTREAM_ERROR: {
    title: "GitHub is having problems right now",
    hint: "Please try again in a moment.",
  },
  AI_NOT_CONFIGURED: {
    title: "AI summaries aren't configured on the server",
    hint: "The backend is missing its GEMINI_API_KEY.",
  },
  AI_EMPTY_RESPONSE: {
    title: "The AI returned an empty response",
    hint: "Retrying usually fixes this.",
  },
  AI_UPSTREAM_ERROR: {
    title: "The AI provider failed to respond",
    hint: "Please try again in a moment.",
  },
  UPSTREAM_ERROR: { title: "The request could not be completed" },
  NETWORK_ERROR: {
    title: "Can't reach the backend",
    hint: "Make sure the Spring Boot server is running and NEXT_PUBLIC_BACKEND_URL is correct.",
  },
  TIMEOUT: {
    title: "The request took too long",
    hint: "The AI may be busy. Please retry.",
  },
};

export function errorCopy(error: unknown): ErrorCopy & { code: string; detail?: string } {
  if (error instanceof ApiError) {
    const copy = ERROR_COPY[error.code] ?? { title: "Something went wrong" };
    return { ...copy, code: error.code, detail: error.message || undefined };
  }
  return { title: "Something went wrong", code: "UNKNOWN" };
}

/** Rate limits and outages are worth retrying; a missing repo is not. */
export function isRetryable(error: unknown): boolean {
  return !(
    error instanceof ApiError &&
    [
      "INVALID_GITHUB_URL",
      "INVALID_REQUEST",
      "GITHUB_REPOSITORY_NOT_FOUND",
      "GITHUB_ACCESS_DENIED",
    ].includes(error.code)
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path);
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { ...authHeaders(), ...(init?.headers as Record<string, string> | undefined) },
      signal: AbortSignal.timeout(120_000),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "TimeoutError") {
      throw new ApiError("", "TIMEOUT");
    }
    throw new ApiError("", "NETWORK_ERROR");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as Partial<ApiErrorBody> | null;
    if (body?.code) throw new ApiError(body.message ?? "", body.code, res.status);
    throw new ApiError(
      "",
      res.status >= 500 ? "NETWORK_ERROR" : "UPSTREAM_ERROR",
      res.status,
    );
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** GET /api/github/repository?url=... */
export function fetchRepository(url: string): Promise<GitHubRepository> {
  return request(`/github/repository?url=${encodeURIComponent(url)}`);
}

/** POST /api/ai/summarize. Fetches repository data once, summarizes and records history. */
export function summarizeRepository(url: string): Promise<SummaryResult> {
  return request("/ai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function fetchHistory(): Promise<HistoryEntry[]> {
  return request("/history");
}

export function updateHistorySaved(id: string, saved: boolean): Promise<HistoryEntry> {
  return request(`/history/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saved }),
  });
}

export function deleteHistoryEntry(id: string): Promise<void> {
  return request(`/history/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function clearHistory(keepSaved = true): Promise<void> {
  return request(`/history?keepSaved=${keepSaved}`, { method: "DELETE" });
}
