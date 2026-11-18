import { Check, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function RepoCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </Card>
  );
}

export function SummarySkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Generating summary">
      <Card>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export interface Step {
  label: string;
  state: "pending" | "active" | "done";
}

/** Shows which stage of the pipeline is running while the AI works. */
export function ProgressSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-live="polite">
      {steps.map((s) => (
        <li
          key={s.label}
          className={cn(
            "flex items-center gap-2",
            s.state === "pending" && "text-muted-foreground",
          )}
        >
          {s.state === "done" ? (
            <Check className="size-4 text-emerald-500" />
          ) : s.state === "active" ? (
            <LoaderCircle className="size-4 animate-spin text-primary" />
          ) : (
            <span className="size-4 rounded-full border" />
          )}
          {s.label}
        </li>
      ))}
    </ol>
  );
}
