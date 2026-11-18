// Mirrors the DTOs of the Spring Boot backend (GitSummarizer-Backend).

/** ai/RepositorySummary.java */
export interface RepositorySummary {
  overview: string;
  features: string[];
  prerequisites: string[];
  releaseNotes: string;
}

export interface SummaryResult {
  repository: GitHubRepository;
  summary: RepositorySummary;
  provider: string;
}

/** github/GitHubRepositoryData.java */
export interface GitHubCommit {
  sha: string;
  message: string;
  author: string | null;
  committedAt: string | null; // ISO instant
  url: string | null;
}

export interface GitHubRepository {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  repositoryUrl: string;
  defaultBranch: string;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  readme: string | null;
  recentCommits: GitHubCommit[];
}

/** github/GitHubApiExceptionHandler.ApiError */
export interface ApiErrorBody {
  code: string;
  message: string;
  timestamp: string;
}

/** A repository summary persisted by the backend for the signed-in user. */
export interface HistoryEntry {
  id: string;
  url: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  summary: RepositorySummary;
  saved: boolean;
  createdAt: string;
}

export interface Profile {
  name: string;
}
