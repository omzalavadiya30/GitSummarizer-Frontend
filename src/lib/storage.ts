"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { getStoredUserId } from "@/lib/auth/session";
import {
  clearHistory,
  deleteHistoryEntry,
  fetchHistory,
  updateHistorySaved,
} from "@/lib/api";

/** User history is stored by the Spring Boot API and scoped to the active account. */
export function useHistory() {
  const userId = getStoredUserId();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["history", userId ?? "signed-out"] as const, [userId]);
  const query = useQuery({
    queryKey,
    queryFn: fetchHistory,
    enabled: !!userId,
  });
  const entries = useMemo(() => query.data ?? [], [query.data]);

  const toggleSaved = useCallback(async (url: string) => {
    const entry = entries.find((item) => item.url === url);
    if (!entry) return;
    await updateHistorySaved(entry.id, !entry.saved);
    await queryClient.invalidateQueries({ queryKey });
  }, [entries, queryClient, queryKey]);

  const remove = useCallback(async (id: string) => {
    await deleteHistoryEntry(id);
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const clear = useCallback(async (keepSaved = true) => {
    await clearHistory(keepSaved);
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { entries, isLoading: query.isLoading, toggleSaved, remove, clear };
}
