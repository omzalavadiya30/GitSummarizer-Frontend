import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorCopy, isRetryable } from "@/lib/api";

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const { title, hint, detail } = errorCopy(error);
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-destructive">{title}</p>
        {hint && <p className="mt-1">{hint}</p>}
        {detail && (
          <p className="mt-1 text-xs text-muted-foreground">Server said: {detail}</p>
        )}
      </div>
      {onRetry && isRetryable(error) && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw /> Retry
        </Button>
      )}
    </div>
  );
}
